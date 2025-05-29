const express = require('express');
const app = express();
const port = 3000;

// The 'qs' library is used internally by Express for parsing query strings.
// By requiring 'qs' directly here, we highlight its usage, but the vulnerability
// often arises from Express's default parsing using 'qs'.
// If you were to remove the 'qs' dependency from package.json and use a newer Express,
// it might default to a patched 'qs' or a different parser.

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This line enables parsing of URL-encoded data,
                                                 // which can trigger the 'qs' vulnerability.

// This endpoint processes the submitted data using Express's body-parser,
// which in turn uses the vulnerable 'qs' library.
app.post('/submit', (req, res) => {
    console.log('Received data:', req.body);

    // In a real application, req.body would be used for business logic.
    // The vulnerability allows an attacker to modify the prototype of Object,
    // which can lead to unexpected behavior or even remote code execution
    // depending on how the application uses JavaScript objects.

    // Example of how the prototype pollution might be observed:
    // If an attacker sends a payload like `__proto__[isAdmin]=true`,
    // then new objects created might inherit `isAdmin: true`.
    // Let's demonstrate by checking a property on a newly created object.
    const newUser = {}; // A new, empty object

    // Check if the `isAdmin` property exists on the newly created object due to pollution
    if (newUser.isAdmin) {
        res.status(200).json({
            status: "VULNERABILITY DETECTED!",
            message: "A property was unexpectedly added to the object prototype. Object.prototype was polluted!",
            receivedData: req.body
        });
    } else {
        res.status(200).json({
            status: "Success",
            message: "Data received successfully. (No obvious prototype pollution detected in this request, try the exploit payload!)",
            receivedData: req.body
        });
    }
});

// A simple GET endpoint to confirm the server is running
app.get('/', (req, res) => {
    res.status(200).send('Vulnerable Node.js backend is running. Send POST requests to /submit.');
});

app.listen(port, () => {
    console.log(`Vulnerable Node.js app listening at http://localhost:${port}`);
    console.log('To exploit: Send a POST request to /submit with query params like:');
    console.log('__proto__[isAdmin]=true&username=hacker&password=pwned');
    console.log('Or using dot notation: constructor.prototype.isAdmin=true');
});

module.exports = app; // Export the app for testing

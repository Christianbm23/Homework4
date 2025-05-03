/* 
 Name: Christian Martinez
 File: homework3.js
 Date Created: 2025-04-10
 Date Updated: 2025-04-13
 Purpose: Validate data on the fly from a form
*/
 
// Validation patterns
const PATTERNS = {
    firstName: /^[a-zA-Z'\-]{1,30}$/,
    middleInitial: /^[a-zA-Z]{0,1}$/,
    lastName: /^[a-zA-Z'\-2-5]{1,30}$/,
    address: /^[a-zA-Z0-9\s\-\.,#']+$/,
    city: /^[a-zA-Z\s\-']{2,30}$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    phoneNumber: /^\d{3}-\d{3}-\d{4}$/,
    email: /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,20}$/i,
    userId: /^[a-zA-Z][a-zA-Z0-9_\-]{4,19}$/
};

// Generic field validator
function validateField(fieldId, pattern, errorMsg, required = true, minLen = 1, maxLen = 30) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`) || createErrorElement(fieldId);
    const fieldName = fieldId.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());

    if (required && !field.value.trim()) {
        errorElement.textContent = `${fieldName} cannot be blank`;
        return false;
    }

    if (field.value.trim()) {
        if (field.value.length < minLen) {
            errorElement.textContent = `Must be at least ${minLen} characters`;
            return false;
        }
        if (field.value.length > maxLen) {
            errorElement.textContent = `Cannot exceed ${maxLen} characters`;
            return false;
        }
        if (pattern && !pattern.test(field.value)) {
            errorElement.textContent = errorMsg;
            return false;
        }
    }

    errorElement.textContent = "";
    return true;
}

// Field-specific validators
const validateFname = () => validateField("fname", PATTERNS.firstName, 
    "First name can only contain letters, apostrophes, and dashes");

const validateMini = () => validateField("mini", PATTERNS.middleInitial, 
    "Middle initial can only be a letter", false, 0, 1);

const validateLname = () => validateField("lname", PATTERNS.lastName, 
    "Last name can only contain letters, apostrophes, dashes, and numbers 2-5");

const validateAddress1 = () => validateField("address1", PATTERNS.address, 
    "Please enter a valid address", true, 2, 30);

const validateAddress2 = () => validateField("address2", PATTERNS.address, 
    "Please enter a valid address", false, 2, 30);

const validateCity = () => validateField("city", PATTERNS.city, 
    "City name can only contain letters, spaces, hyphens, and apostrophes", true, 2, 30);

const validateEmail = () => validateField("email", PATTERNS.email, 
    "Please enter a valid email address (format: name@domain.tld)");

function validateUid() {
    const userId = document.getElementById("uid");
    userId.value = userId.value.toLowerCase();
    
    if (!validateField("uid", PATTERNS.userId, 
        "User ID can only contain letters, numbers, underscores, and dashes", true, 5, 20)) {
        return false;
    }
    
    if (!isNaN(userId.value.charAt(0))) {
        document.getElementById("uid-error").textContent = "User ID cannot start with a number";
        return false;
    }
    
    return true;
}

// Date validation
function validateDob() {
    const dob = document.getElementById("dob");
    const errorElement = document.getElementById("dob-error") || createErrorElement("dob");
    
    if (!dob.value) {
        errorElement.textContent = "Date of birth is required";
        return false;
    }
    
    const inputDate = new Date(dob.value);
    const today = new Date();
    const oldestDate = new Date();
    oldestDate.setFullYear(today.getFullYear() - 120);

    if (inputDate > today) {
        errorElement.textContent = "Date can't be in the future";
        return false;
    }
    if (inputDate < oldestDate) {
        errorElement.textContent = "Date can't be more than 120 years ago";
        return false;
    }
    
    errorElement.textContent = "";
    return true;
}

// SSN validation and formatting
function validateSsn() {
    const ssn = document.getElementById("ssn");
    const errorElement = document.getElementById("ssn-error") || createErrorElement("ssn");
    const digits = ssn.value.replace(/\D/g, "");
    
    if (!digits) {
        errorElement.textContent = "SSN is required";
        return false;
    }
    if (digits.length !== 9) {
        errorElement.textContent = "Please enter a valid 9-digit SSN";
        return false;
    }
    
    ssn.value = `${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 9)}`;
    errorElement.textContent = "";
    return true;
}

function formatSsn(input) {
    const digits = input.value.replace(/\D/g, "");
    if (!digits) return;
    
    if (digits.length <= 3) {
        input.value = digits;
    } else if (digits.length <= 5) {
        input.value = `${digits.substring(0, 3)}-${digits.substring(3)}`;
    } else {
        input.value = `${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 9)}`;
    }
}

// Zip code validation
function validateZcode() {
    const zip = document.getElementById("zcode");
    const errorElement = document.getElementById("zcode-error") || createErrorElement("zcode");
    const value = zip.value.replace(/[^\d-]/g, "");
    
    if (!value.trim()) {
        errorElement.textContent = "Zip code is required";
        return false;
    }
    if (!PATTERNS.zipCode.test(zip.value)) {
        errorElement.textContent = "Please enter a valid 5-digit or 9-digit zip code";
        return false;
    }
    
    errorElement.textContent = "";
    return true;
}

function formatZipCode(input) {
    const digits = input.value.replace(/[^\d-]/g, "");
    if (digits.length > 5 && !digits.includes("-")) {
        input.value = `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    } else {
        input.value = digits;
    }
}

// Phone validation
function validatePhone() {
    const phone = document.getElementById("phone");
    const errorElement = document.getElementById("phone-error") || createErrorElement("phone");
    
    if (!phone.value.trim()) {
        errorElement.textContent = "Phone number is required";
        return false;
    }
    if (!PATTERNS.phoneNumber.test(phone.value)) {
        errorElement.textContent = "Please enter a valid phone number (format: 123-456-7890)";
        return false;
    }
    
    errorElement.textContent = "";
    return true;
}

function formatPhoneNumber(input) {
    const digits = input.value.replace(/\D/g, "");
    if (!digits) return;
    
    if (digits.length <= 3) {
        input.value = digits;
    } else if (digits.length <= 6) {
        input.value = `${digits.substring(0, 3)}-${digits.substring(3)}`;
    } else {
        input.value = `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
    }
}

// Radio button and dropdown validation
function validateGender() {
    const isSelected = [...document.getElementsByName("gender")].some(radio => radio.checked);
    const errorElement = document.getElementById("gender-error") || createErrorElement("gender");
    
    errorElement.textContent = isSelected ? "" : "Please select a gender";
    return isSelected;
}

function validateState() {
    const state = document.getElementById("state");
    const errorElement = document.getElementById("state-error") || createErrorElement("state");
    
    if (!state.value) {
        errorElement.textContent = "Please select a state";
        return false;
    }
    
    errorElement.textContent = "";
    return true;
}

// Password validation
function validatePword() {
    const password = document.getElementById("pword").value;
    const userId = document.getElementById("uid").value;
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const messages = [];
    
    // Clear existing messages
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`msg${i}`).textContent = "";
    }
    
    // Check requirements
    if (!password) {
        messages.push("Password is required");
    } else {
        if (password.length < 8) messages.push("Must be at least 8 characters");
        if (!/[a-z]/.test(password)) messages.push("Needs a lowercase letter");
        if (!/[A-Z]/.test(password)) messages.push("Needs an uppercase letter");
        if (!/[0-9]/.test(password)) messages.push("Needs a number");
        if (!/[!@#$%^&*()\-_+=\\\/><.,`~]/.test(password)) {
            messages.push("Needs a special character");
        }
        if (userId && password.toLowerCase() === userId.toLowerCase()) {
            messages.push("Cannot match user ID");
        }
        if ((firstName && password.toLowerCase().includes(firstName.toLowerCase())) || 
            (lastName && password.toLowerCase().includes(lastName.toLowerCase()))) {
            messages.push("Cannot contain your name");
        }
    }
    
    // Display messages
    messages.slice(0, 4).forEach((msg, i) => {
        document.getElementById(`msg${i+1}`).textContent = msg;
    });
    
    const errorElement = document.getElementById("pword-error") || createErrorElement("pword");
    errorElement.textContent = messages.length ? "Password doesn't meet requirements" : "";
    return messages.length === 0;
}

function confirmPword() {
    const password = document.getElementById("pword").value;
    const confirm = document.getElementById("pword2").value;
    const errorElement = document.getElementById("pword2-error") || createErrorElement("pword2");
    
    if (!confirm) {
        errorElement.textContent = "Please confirm your password";
        return false;
    }
    if (password !== confirm) {
        errorElement.textContent = "Passwords don't match";
        return false;
    }
    
    errorElement.textContent = "";
    return true;
}

// Helper functions
function createErrorElement(fieldId) {
    const errorSpan = document.createElement("span");
    errorSpan.id = `${fieldId}-error`;
    errorSpan.className = "error";
    
    const field = document.getElementById(fieldId);
    if (field && field.parentNode) {
        field.parentNode.appendChild(errorSpan);
    }
    
    return errorSpan;
}

function validateEverything() {
    const validations = [
        validateFname, validateMini, validateLname, validateDob, validateSsn,
        validateAddress1, validateAddress2, validateState, validateZcode,
        validatePhone, validateGender, validateEmail, validateUid,
        validatePword, confirmPword
    ];
    
    const isValid = validations.every(validation => validation());
    
    // Format email to lowercase
    const email = document.getElementById("email");
    if (email.value) {
        email.value = email.value.toLowerCase();
    }
    
    return isValid;
}

function focusFirstError() {
    const errorElement = document.querySelector(".error[textContent]");
    if (errorElement) {
        const fieldId = errorElement.id.replace("-error", "");
        document.getElementById(fieldId).focus();
    }
}

function showAlert(message) {
    const alertBox = document.getElementById("alert-box");
    const alertContent = document.getElementById("alert-content");
    
    alertContent.querySelector("h4").textContent = message;
    alertBox.style.display = "flex";
    
    document.getElementById("close-alert").onclick = function() {
        alertBox.style.display = "none";
    };
}

function reviewInput() {
    const formData = new FormData(document.getElementById("signup"));
    let output = "<h3>Review Your Information</h3><table class='output'>";
    const conditions = [];
    
    for (const [key, value] of formData.entries()) {
        if (key === "pword" || key === "pword2") {
            output += `<tr><td>${formatLabel(key)}:</td><td>********</td></tr>`;
        } else if (key === "ssn") {
            output += `<tr><td>Social Security Number:</td><td>${value.replace(/\d(?=\d{4})/g, "*")}</td></tr>`;
        } else if (key === "medical_conditions") {
            conditions.push(value.replace(/_/g, ' '));
        } else {
            output += `<tr><td>${formatLabel(key)}:</td><td>${value || "Not provided"}</td></tr>`;
        }
    }
    
    if (conditions.length) {
        output += `<tr><td>Medical Conditions:</td><td>${conditions.join(", ")}</td></tr>`;
    }
    
    document.getElementById("showInput").innerHTML = output + "</table>";
}

function formatLabel(key) {
    const labels = {
        "fname": "First Name", "mini": "Middle Initial", "lname": "Last Name",
        "ssn": "Social Security Number", "address1": "Address Line 1", 
        "address2": "Address Line 2", "city": "City", "state": "State",
        "zcode": "Zip Code", "phone": "Phone Number", "dob": "Date of Birth",
        "gender": "Gender", "email": "Email", "uid": "User ID",
        "pword": "Password", "pword2": "Confirm Password",
        "medical_conditions": "Medical Conditions", "painLevel": "Pain Level",
        "notes": "Additional Notes"
    };
    
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
}

// Initialize form
function initializeForm() {
    document.getElementById("alert-box").style.display = "none";
    document.getElementById("today").textContent = new Date().toLocaleDateString();
    
    // Setup formatters
    const formatters = {
        "ssn": formatSsn,
        "phone": formatPhoneNumber,
        "zcode": formatZipCode
    };
    
    Object.entries(formatters).forEach(([id, formatter]) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", function() {
                formatter(this);
                window[`validate${id.charAt(0).toUpperCase() + id.slice(1)}`]();
            });
        }
    });
    
    // Setup pain level display
    const painSlider = document.getElementById("painLevel");
    const painDisplay = document.querySelector(".slider-value");
    if (painSlider && painDisplay) {
        painSlider.addEventListener("input", () => {
            painDisplay.textContent = `${painSlider.value}`;
        });
        painDisplay.textContent = `${painSlider.value}`;
    }
    
    // Setup real-time validation
    const validationMap = {
        "fname": validateFname, "mini": validateMini, "lname": validateLname,
        "ssn": validateSsn, "address1": validateAddress1, "address2": validateAddress2,
        "city": validateCity, "zcode": validateZcode, "phone": validatePhone,
        "dob": validateDob, "email": validateEmail, "uid": validateUid,
        "pword": validatePword, "pword2": confirmPword
    };
    
    Object.entries(validationMap).forEach(([id, validator]) => {
        const field = document.getElementById(id);
        if (field) {
            ["input", "blur"].forEach(event => {
                field.addEventListener(event, validator);
            });
        }
    });
    
    // Special password validation
    const passwordField = document.getElementById("pword");
    if (passwordField) {
        ["input", "blur"].forEach(event => {
            passwordField.addEventListener(event, () => {
                validatePword();
                if (document.getElementById("pword2").value) {
                    confirmPword();
                }
            });
        });
    }
    
    // Radio and dropdown validation
    document.querySelectorAll('[name="gender"]').forEach(radio => {
        radio.addEventListener("change", validateGender);
    });
    
    document.getElementById("state").addEventListener("change", validateState);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    initializeForm();
    
    document.getElementById("signup").addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateEverything()) {
            e.target.submit();
        } else {
            showAlert("Please correct the highlighted fields before submitting.");
            focusFirstError();
        }
    });
    
    document.getElementById("review").addEventListener("click", reviewInput);
});

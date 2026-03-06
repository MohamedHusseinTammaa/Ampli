import validator from "validator";

export const createCvSchema = {
  "personal.name": {
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "Name must be between 2 and 100 characters",
    },
  },
  "personal.email": {
    trim: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
    custom: {
      options: (value) => {
        if (!value || typeof value !== "string") {
          throw new Error("Email is required");
        }
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email address");
        }
        return true;
      },
    },
  },
  "personal.phone": {
    trim: true,
    notEmpty: {
      errorMessage: "Phone is required",
    },
    isString: {
      errorMessage: "Phone must be a string",
    },
    custom: {
      options: (value) => {
        if (!value || typeof value !== "string") {
          throw new Error("Phone is required");
        }
        const cleaned = value.replace(/[\s\-\(\)\+]/g, "");
        if (!validator.isMobilePhone(cleaned, "any", { strictMode: false })) {
          throw new Error("Please enter a valid phone number");
        }
        return true;
      },
    },
  },
  summary: {
    optional: true,
    isString: {
      errorMessage: "Summary must be a string",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Summary must be at most 1000 characters",
    },
  },
  "experience.*.company": {
    optional: true,
    isString: {
      errorMessage: "Company must be a string",
    },
    trim: true,
  },
  "experience.*.role": {
    optional: true,
    isString: {
      errorMessage: "Role must be a string",
    },
    trim: true,
  },
  "experience.*.start": {
    optional: true,
    isString: {
      errorMessage: "Start must be a string",
    },
    trim: true,
  },
  "experience.*.end": {
    optional: true,
    isString: {
      errorMessage: "End must be a string",
    },
    trim: true,
  },
  "experience.*.description": {
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  "education.*.school": {
    optional: true,
    isString: {
      errorMessage: "School must be a string",
    },
    trim: true,
  },
  "education.*.degree": {
    optional: true,
    isString: {
      errorMessage: "Degree must be a string",
    },
    trim: true,
  },
  "education.*.year": {
    optional: true,
    isString: {
      errorMessage: "Year must be a string",
    },
    trim: true,
  },
  skills: {
    optional: true,
    isArray: {
      errorMessage: "Skills must be an array",
    },
  },
  "skills.*": {
    optional: true,
    isString: {
      errorMessage: "Each skill must be a string",
    },
    trim: true,
  },
};

export const updateCvSchema = {
  "personal.name": {
    optional: true,
    trim: true,
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "Name must be between 2 and 100 characters",
    },
  },
  "personal.email": {
    optional: true,
    trim: true,
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
    custom: {
      options: (value) => {
        if (!value || typeof value !== "string") {
          throw new Error("Email is required");
        }
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email address");
        }
        return true;
      },
    },
  },
  "personal.phone": {
    optional: true,
    trim: true,
    isString: {
      errorMessage: "Phone must be a string",
    },
    custom: {
      options: (value) => {
        if (!value || typeof value !== "string") {
          throw new Error("Phone is required");
        }
        const cleaned = value.replace(/[\s\-\(\)\+]/g, "");
        if (!validator.isMobilePhone(cleaned, "any", { strictMode: false })) {
          throw new Error("Please enter a valid phone number");
        }
        return true;
      },
    },
  },
  summary: {
    optional: true,
    isString: {
      errorMessage: "Summary must be a string",
    },
    isLength: {
      options: { max: 1000 },
      errorMessage: "Summary must be at most 1000 characters",
    },
  },
  "experience.*.company": {
    optional: true,
    isString: {
      errorMessage: "Company must be a string",
    },
    trim: true,
  },
  "experience.*.role": {
    optional: true,
    isString: {
      errorMessage: "Role must be a string",
    },
    trim: true,
  },
  "experience.*.start": {
    optional: true,
    isString: {
      errorMessage: "Start must be a string",
    },
    trim: true,
  },
  "experience.*.end": {
    optional: true,
    isString: {
      errorMessage: "End must be a string",
    },
    trim: true,
  },
  "experience.*.description": {
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  "education.*.school": {
    optional: true,
    isString: {
      errorMessage: "School must be a string",
    },
    trim: true,
  },
  "education.*.degree": {
    optional: true,
    isString: {
      errorMessage: "Degree must be a string",
    },
    trim: true,
  },
  "education.*.year": {
    optional: true,
    isString: {
      errorMessage: "Year must be a string",
    },
    trim: true,
  },
  skills: {
    optional: true,
    isArray: {
      errorMessage: "Skills must be an array",
    },
  },
  "skills.*": {
    optional: true,
    isString: {
      errorMessage: "Each skill must be a string",
    },
    trim: true,
  },
};


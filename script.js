// console.log("CareerMate AI Landing Page loaded successfully! 🚀");
const backToTop = document.getElementById("backToTop");
// console.log(backToTop);

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const FormValidator = {
  rules: {
    fullname: {
      required: true,
      minLength: 2,
      message: "Please enter your full name at least 2 characters",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    message: {
      required: true,
      minLength: 10,
      message: "Message must be at least 10 characters long",
    },
    terms: {
      required: true,
      message: "You must agree to the terms of service",
    },
  },

  // 验证的逻辑
  validateField(field) {
    // 先拿到每个field的name value rule 三个值，再进行验证逻辑
    const fieldName = field.name;
    const fieldValue =
      field.type === "checkbox" ? field.checked : field.value.trim();
    const rule = this.rules[fieldName];

    if (!rule) return;
    // required validation
    if (rule.required) {
      // no value
      if (field.type === "checkbox" && !fieldValue) {
        this.showError(field, rule.message);
        return false;
      }
      if (field.type !== "checkbox" && !fieldValue) {
        this.showError(field, rule.message);
        return false;
      }

      //   if (!fieldValue && !rule.required) {
      //   this.showSuccess(field);
      //   return true;
      // }
    }

    // min length validation
    if (rule.minLength && fieldValue.length < rule.minLength) {
      this.showError(field, rule.message);
      return false;
    }

    // pattern validation
    if (rule.pattern && !rule.pattern.test(fieldValue)) {
      this.showError(field, rule.message);
      return false;
    }

    // others are show success
    this.showSuccess(field);
    return true;
  },

  // error显示的逻辑
  showError(field, message) {
    const formGroup =
      field.closest(".form-group") || field.closest(".form-checkbox");

    formGroup.classList.remove("error");
    formGroup.classList.add("error");

    const existedErr = formGroup.querySelector(".error-message");
    if (existedErr) {
      existedErr.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `<span>⚠</span> ${message}`;

    if (field.type === "form-checkbox") {
      formGroup.appendChild(errorDiv);
      //此写法和下面的，dom位置一样。bug:css里忘写了，errorDiv加了也没用
    } else {
      field.parentNode.appendChild(errorDiv);
    }
  },

  // Success显示的逻辑
  showSuccess(field) {
    const formGroup =
      field.closest(".form-group") || field.closest(".form-checkbox");
    formGroup.classList.remove("error");
    formGroup.classList.add("success");
    const existedErr = formGroup.querySelector(".error-message");
    if (existedErr) {
      existedErr.remove();
    }
  },

  //validate form
  validateForm() {
    const validateFields = contactForm.querySelectorAll(
      '[name="fullname"], [name="email"], [name="message"], [name="terms"]'
    );

    const isValid = true;
    validateFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },
};

(function () {
  emailjs.init(EmailConfig.PUBLIC_KEY);
})();

// 拿到要validate的fields 放到 validateField里 遍历
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const validateFields = contactForm.querySelectorAll(
    '[name="fullname"], [name="email"], [name="message"], [name="terms"]'
  );
  // console.log(validateFields);
  validateFields.forEach((field) => {
    field.addEventListener("blur", function () {
      FormValidator.validateField(this);
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid = FormValidator.validateForm(this);

    if (!isValid) {
      // Scroll to first error
      const firstError = this.querySelector(
        ".form-group.error, .form-checkbox.error"
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    emailjs
      .sendForm(EmailConfig.SERVICE_ID, EmailConfig.TEMPLATE_ID, this)
      .then(
        () => {
          console.log("this email send success");
        },
        (error) => {
          console.log("this is error message");
        }
      );
  });
}

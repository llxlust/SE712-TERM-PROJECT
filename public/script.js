document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const messageBox = document.getElementById("validationMessage");

  if (!form || !messageBox) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    messageBox.classList.add("hidden");
    messageBox.textContent = "";

    const invalidClass = ["border-rose-500", "ring-2", "ring-rose-500"];

    const clearFieldError = (element) => {
      if (!element) return;
      element.classList.remove(...invalidClass);
    };

    const clearFieldMessage = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "";
        el.classList.add("hidden");
      }
    };

    form.querySelectorAll("input, select").forEach(clearFieldError);
    form.querySelectorAll("label").forEach(clearFieldError);

    clearFieldMessage("error-firstName");
    clearFieldMessage("error-lastName");
    clearFieldMessage("error-phone");
    clearFieldMessage("error-age");
    clearFieldMessage("error-email");
    clearFieldMessage("error-nationality");
    clearFieldMessage("error-shirtSize");
    clearFieldMessage("error-category");

    const formData = new FormData(form);

    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const ageValue = formData.get("age")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const nationality = formData.get("nationality")?.toString().trim();
    const shirtSize = formData.get("shirtSize")?.toString().trim();
    const category = formData.get("category")?.toString().trim();

    const errors = [];

    const markError = (selector, messageId, message) => {
      const field = form.querySelector(selector);

      if (field) {
        field.classList.add("border-rose-500", "ring-2", "ring-rose-500");
      }

      const errorField = document.getElementById(messageId);

      if (errorField) {
        errorField.textContent = message;
        errorField.classList.remove("hidden");
      }
    };

    if (!firstName) {
      errors.push("กรุณากรอกชื่อ");

      markError('input[name="firstName"]', "error-firstName", "กรุณากรอกชื่อ");
    }

    if (!lastName) {
      errors.push("กรุณากรอกนามสกุล");

      markError('input[name="lastName"]', "error-lastName", "กรุณากรอกนามสกุล");
    }

    if (!phone) {
      errors.push("กรุณากรอกเบอร์โทรติดต่อ");

      markError(
        'input[name="phone"]',
        "error-phone",
        "กรุณากรอกเบอร์โทรติดต่อ",
      );
    } else if (!/^0\d{8,9}$/.test(phone)) {
      errors.push("กรุณากรอกเบอร์โทรศัพท์ในรูปแบบที่ถูกต้อง เช่น 08xxxxxxxx");

      markError(
        'input[name="phone"]',
        "error-phone",
        "กรุณากรอกเบอร์โทรศัพท์ในรูปแบบที่ถูกต้อง เช่น 08xxxxxxxx",
      );
    }

    const age = Number(ageValue);

    if (!ageValue) {
      errors.push("กรุณากรอกอายุ");

      markError('input[name="age"]', "error-age", "กรุณากรอกอายุ");
    } else if (Number.isNaN(age) || age < 0) {
      errors.push("กรุณากรอกอายุเป็นตัวเลขที่ถูกต้อง");

      markError(
        'input[name="age"]',
        "error-age",
        "กรุณากรอกอายุเป็นตัวเลขที่ถูกต้อง",
      );
    }

    if (!email) {
      errors.push("กรุณากรอกอีเมล");

      markError('input[name="email"]', "error-email", "กรุณากรอกอีเมล");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง");

      markError(
        'input[name="email"]',
        "error-email",
        "กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง",
      );
    }

    if (!nationality) {
      errors.push("กรุณาเลือกสัญชาติ");

      markError(
        'select[name="nationality"]',
        "error-nationality",
        "กรุณาเลือกสัญชาติ",
      );
    }

    if (!shirtSize) {
      errors.push("กรุณาเลือกขนาดเสื้อ");

      markError(
        'select[name="shirtSize"]',
        "error-shirtSize",
        "กรุณาเลือกขนาดเสื้อ",
      );
    }

    // category จะ required เฉพาะหน้าที่มี field category
    const categoryInputs = form.querySelectorAll('input[name="category"]');

    if (categoryInputs.length > 0 && !category) {
      errors.push("กรุณาเลือกประเภทการแข่งขัน");

      categoryInputs.forEach((input) => {
        const label = input.closest("label");

        if (label) {
          label.classList.add("border-rose-500", "ring-2", "ring-rose-500");
        }
      });

      const categoryError = document.getElementById("error-category");

      if (categoryError) {
        categoryError.textContent = "กรุณาเลือกประเภทการแข่งขัน";

        categoryError.classList.remove("hidden");
      }
    }

    if (errors.length > 0) {
      console.log(errors, ":errors");

      messageBox.textContent =
        "ไม่สามารถดำเนินการต่อได้ กรุณากรอกข้อมูลให้ครบทุกช่อง";

      messageBox.classList.remove("hidden");

      return;
    }

    const successMessage = document.createElement("div");

    successMessage.className =
      "success-message mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800";

    successMessage.textContent = `สมัครสำเร็จ! แล้วเจอกัน ${firstName} ${lastName}.`;

    const existingSuccess = document.querySelector(".success-message");

    if (existingSuccess) {
      existingSuccess.remove();
    }

    form.insertAdjacentElement("afterend", successMessage);

    form.reset();
  });
});

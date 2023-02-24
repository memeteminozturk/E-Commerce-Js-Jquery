$(() => {
  var productsDom = $(".products");
  $.getJSON("products.json", (products) => {
    products.forEach((product) => {
      productsDom.append(`
        <div class="col-md-3">
            <div class="product">
            <div class="product-image">
                <img src="${product.image}"/>
                <div class="product-stock">Stock ${product.stock}</div>
            </div>
                <h2 class="product-title" title="${product.title}">${product.title}</h2>
                <p class="product-price">${product.price} TL</p>
                <a class="btn w-100">Add to Cart</a>
            </div>
        </div>`);
    });
  });

  let cart = [];
  const cartDom = $(".cart .container .row .cart-items");
  const cartInfoDom = $(".cart-info");
  const cartTotalDom = $(".cart-total");
  const cartCountDom = $(".cart-count");
  const miniCartDom = $(".mini-cart-content .container .row .mini-cart-items");
  const miniCartCountDom = $(".mini-cart-count");
  const miniCartTotalDom = $(".mini-cart-total");
  const miniCartItemDelete = $(".mini-cart-item-delete");
  let cartTotal = 0;
  let cartCount = 0;
  miniCartCountDom.text(cartCount);
  $(".cart-count").text(cartCount);
  $(".mini-cart-total").text(cartTotal.toFixed(2) + " TL");
  $(".cart-total").text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");

  function saveLocalCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  function addToCart(product) {
    const cartItem = cart.find((item) => item.title === product.title);
    if (cartItem) {
      if (cartItem.stock > cartItem.productAmount) {
        cartTotal += parseFloat(product.price);
        cartCount += 1;
        cartItem.productAmount += 1;
        product.productAmount = cartItem.productAmount;
        cartCountDom.text(cartCount);
        miniCartCountDom.text(cartCount);
        cartTotalDom.text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");
        miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
      } else {
        alert("Insufficient stock for the quantity entered");
      }
    } else {
      cart.push(product);
      cartTotal += parseFloat(product.price);
      cartCount += 1;
      product.productAmount = 1;
      cartTotalDom.text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");
      cartCountDom.text(cartCount);
      miniCartCountDom.text(cartCount);
      miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
    }
  }

  function deleteFromCart(product) {
    const cartItem = cart.find((item) => item.title === product.title);
    cart = cart.filter((item) => item.title !== product.title);
    cartTotal -= parseFloat(cartItem.price) * cartItem.productAmount;
    cartCount -= cartItem.productAmount;
    cartTotalDom.text("TOTAL " + cartTotal.toFixed(2) + " TL");
    cartCountDom.text(cartCount);
    miniCartCountDom.text(cartCount);
    miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
  }

  function displayCart() {
    if (cart.length == 0) {
      miniCartDom.html(`<h2 class="mini-cart-empty">Your cart is empty</h2>`);
      cartDom.html("");
      $(".mini-cart-total-section").css("display", "none");
      cartInfoDom.html(`<h2 class="cart-info-empty">Your cart is empty</h2>`);
    } else {
      $(".mini-cart-total-section").css("display", "flex");
      cartDom.html("");
      cart.map((item) => {
        productTotal = item.productAmount * item.price;
        cartDom.prepend(`
      <div class="cart-item">
      <img src="${item.image}"/>
      <h3 class="cart-item-title">${item.title}</h3>
      <p class="cart-item-quantity"><span class="decrease">-</span> ${
        item.productAmount
      }<span class="increase">+</span></p>
      <p class="cart-item-price">${item.price} TL</p>
      <p class="cart-item-total">${productTotal.toFixed(2)} TL</p>
      <i class="fa fa-trash cart-item-delete"></i>
      </div>
      `);
      });

      cartInfoDom.html(`
      <h2 class="cart-info-header">Cart Info</h2>
      <div class="cart-info-item">
      <p class="cart-info-title">Total Product</p>
      <p class="cart-info-value">${cartCount}</p>
      </div>
      <div class="cart-info-item">
      <p class="cart-info-title">Total Amount</p>
      <p class="cart-info-value">${cartTotal.toFixed(2)} TL</p>
      </div>
      `);

      miniCartDom.html("");
      cart.map((item) => {
        miniCartDom.prepend(`
      <div class="cart-item">
      <img src="${item.image}"/>
      <h3 class="cart-item-title">${item.title}</h3>
      <p class="cart-item-price">${item.productAmount}x${item.price} TL</p>
      <i class="fa fa-times mini-cart-item-delete"></i>
      </div>
      `);
      });
    }
  }

  function decreaseQuantity(product) {
    const cartItem = cart.find((item) => item.title === product.title);
    product = cartItem;
    if (product.productAmount > 1) {
      product.productAmount -= 1;
      cartTotal -= parseFloat(product.price);
      cartCount -= 1;
      cartTotalDom.text("TOTAL " + cartTotal.toFixed(2) + " TL");
      cartCountDom.text(cartCount);
      miniCartCountDom.text(cartCount);
      miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
    } else {
      deleteFromCart(product);
    }
  }

  function increaseQuantity(product) {
    const cartItem = cart.find((item) => item.title === product.title);
    if (cartItem.stock > cartItem.productAmount) {
      product = cartItem;
      product.productAmount += 1;
      cartTotal += parseFloat(product.price);
      cartCount += 1;
      cartTotalDom.text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");
      cartCountDom.text(cartCount);
      miniCartCountDom.text(cartCount);
      miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
    } else {
      alert("Insufficient stock for the quantity entered");
    }
  }

  // window.onload = function () {
  //   if (localStorage.getItem("shoppingCart")) {
  //     cart = JSON.parse(localStorage.getItem("shoppingCart"));
  //     cart.map((item) => {
  //       cartTotal += parseFloat(item.price) * item.productAmount;
  //       cartCount += item.productAmount;
  //       cartTotalDom.text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");
  //       cartCountDom.text(cartCount);
  //       miniCartCountDom.text(cartCount);
  //       miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
  //     });
  //   }
  //   displayCart();
  // };

  $(".mini-cart-content .container .row .mini-cart-items").on(
    "click",
    ".decrease",
    function () {
      let product = {
        image: $(this).parent().parent().find("img").attr("src"),
        title: $(this).parent().parent().find(".cart-item-title").text(),
        price: $(this).parent().parent().find(".cart-item-price").text(),
      };
      decreaseQuantity(product);
      displayCart();
      saveLocalCart();
    }
  );

  $(".cart .container .row .cart-items").on("click", ".decrease", function () {
    let product = {
      image: $(this).parent().parent().find("img").attr("src"),
      title: $(this).parent().parent().find(".cart-item-title").text(),
      price: $(this).parent().parent().find(".cart-item-price").text(),
    };
    decreaseQuantity(product);
    displayCart();
    saveLocalCart();
  });

  $(".mini-cart-content .container .row .mini-cart-items").on(
    "click",
    ".increase",
    function () {
      let product = {
        image: $(this).parent().parent().find("img").attr("src"),
        title: $(this).parent().parent().find(".cart-item-title").text(),
        price: $(this).parent().parent().find(".cart-item-price").text(),
      };
      increaseQuantity(product);
      displayCart();
      saveLocalCart();
    }
  );

  $(".cart .container .row .cart-items").on("click", ".increase", function () {
    let product = {
      image: $(this).parent().parent().find("img").attr("src"),
      title: $(this).parent().parent().find(".cart-item-title").text(),
      price: $(this).parent().parent().find(".cart-item-price").text(),
    };
    increaseQuantity(product);
    displayCart();
    saveLocalCart();
  });

  $(".products").on("click", ".btn", function () {
    let product = {
      image: $(this).parent().find("img").attr("src"),
      title: $(this).parent().find(".product-title").text(),
      price: $(this).parent().find(".product-price").text().replace(" TL", ""),
      stock: $(this)
        .parent()
        .find(".product-stock")
        .text()
        .replace("Stock ", ""),
    };
    addToCart(product);
    displayCart();
    saveLocalCart();
  });

  $(".mini-cart-content .container .row .mini-cart-items").on(
    "click",
    ".mini-cart-item-delete",
    function () {
      let product = {
        image: $(this).parent().find("img").attr("src"),
        title: $(this).parent().find(".cart-item-title").text(),
        price: $(this)
          .parent()
          .find(".cart-item-price")
          .text()
          .replace(" TL", ""),
      };
      deleteFromCart(product);
      displayCart();
      saveLocalCart();
    }
  );

  $(".cart .container .row .cart-items").on(
    "click",
    ".cart-item-delete",
    function () {
      let product = {
        image: $(this).parent().find("img").attr("src"),
        title: $(this).parent().find(".cart-item-title").text(),
        price: $(this)
          .parent()
          .find(".cart-item-price")
          .text()
          .replace(" TL", ""),
      };
      deleteFromCart(product);
      displayCart();
      saveLocalCart();
    }
  );


  const name = $("#name");
  const signupEmail = $("#signup-form #email");
  const signupPassword = $("#signup-form #password");
  const signupPasswordConf = $("#signup-form #password-conf");
  const passwordConfError = $("#password-conf-error");
  const nameError = $("#name-error");
  const phone = $("#phone");
  const phoneError = $("#phone-error");
  const agreement = $("#agreement");
  const agreementError = $("#agreement-error");
  const signupForm = $("#signup-form");

  // LOGIN PAGE
  const togglePassword = $("#toggle-password");
  const logPassword = $("#login-form #password");
  const password = $("#password");

  togglePassword.on("click", function () {
    const type = password.attr("type") === "password" ? "text" : "password";
    password.attr("type", type);
    $(this).toggleClass("fa-eye-slash");
  });

  // INPUT VALIDATION
  const logEmail = $("#login-form #email");
  const loginForm = $("#login-form");
  const emailError = $("#email-error");
  const passwordError = $("#password-error");
  const logout = $(".logout-link");

  //CHECK NAME INPUT
  function checkName() {
    const nameValue = name.val().trim();
    if (nameValue === "") {
      nameError.text("Name cannot be blank");
      nameError.css("display", "block");
      return false;
    } else {
      nameError.css("display", "none");
      return true;
    }
  }

  function checkEmail() {
    const emailValue = signupEmail.val().trim();
    if (emailValue === "") {
      emailError.text("Email cannot be blank");
      emailError.css("display", "block");
      return false;
    } else if (!isEmail(emailValue)) {
      emailError.text("Email format is incorrect");
      emailError.css("display", "block");
      return false;
    } else if (emailExists(emailValue)) {
      emailError.text("Email already exists");
      emailError.css("display", "block");
      return false;
    } else {
      emailError.css("display", "none");
      return true;
    }
  }

  function emailExists(emailValue) {
    users = JSON.parse(localStorage.getItem("users"));
    if (users) {
      for (user of users) {
        if (user.email === emailValue) {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  function isEmail(signupEmail) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(signupEmail);
  }

  function checkPassword() {
    const passwordValue = signupPassword.val().trim();
    if (passwordValue === "") {
      passwordError.text("Password cannot be blank");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.length < 6) {
      passwordError.text("Your password must be at least 6 characters");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.length > 20) {
      passwordError.text("Your password must be less than 20 characters");
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[A-Z]/)) {
      passwordError.text(
        "Your password must contain at least one uppercase letter"
      );
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[a-z]/)) {
      passwordError.text(
        "Your password must contain at least one lowercase letter"
      );
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[0-9]/)) {
      passwordError.text("Your password must contain at least one number");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.match(/\s/)) {
      passwordError.text("Your password must not contain any spaces");
      passwordError.css("display", "block");
      return false;
    } else {
      passwordError.css("display", "none");
      return true;
    }
  }

  function checkPhone() {
    const phoneValue = phone.val().trim();
    if (phoneValue === "") {
      phoneError.text("Phone cannot be blank");
      phoneError.css("display", "block");
      return false;
    } else if (!isPhone(phoneValue)) {
      phoneError.text("Phone format is incorrect");
      phoneError.css("display", "block");
      return false;
    } else {
      phoneError.css("display", "none");
      return true;
    }
  }

  function isPhone(phone) {
    return /^(\+90|0)?[0-9]{10}$/.test(phone);
  }

  function checkPasswordConfirm() {
    const passwordValue = signupPassword.val().trim();
    const passwordConfirmValue = signupPasswordConf.val().trim();
    if (passwordValue !== passwordConfirmValue) {
      passwordConfError.text("Passwords do not match");
      passwordConfError.css("display", "block");
      return false;
    } else {
      passwordConfError.css("display", "none");
      return true;
    }
  }

  function checkAgreement() {
    if (!agreement.is(":checked")) {
      agreementError.text("You must accept the agreement");
      agreementError.css("display", "block");
      return false;
    } else {
      agreementError.css("display", "none");
      return true;
    }
  }

  function registerUser() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const nameValue = name.val().trim();
    const emailValue = signupEmail.val().trim();
    const passwordValue = signupPassword.val().trim();
    const phoneValue = phone.val().trim();
    const newUser = {
      id: users.length + 1,
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      phone: phoneValue,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  }

  function saveUser() {
    const logEmailValue = logEmail.val().trim();
    localStorage.setItem("email", logEmailValue);
  }

  function isLoggedIn() {
    return localStorage.getItem("email") !== null;
  }

  function logoutUser() {
    localStorage.removeItem("email");
    window.location.href = "index.html";
    $(".login-link").css("display", "block");
    $(".signup-link").css("display", "block");
    $(".logout-link").css("display", "none");
    $(".user-link").css("display", "none");
  }

  function checkLoginEmail() {
    const logEmailValue = logEmail.val().trim();
    if (logEmailValue === "") {
      emailError.text("Email cannot be blank");
      emailError.css("display", "block");
      return false;
    } else if (matchesEmail(logEmailValue) === false) {
      emailError.text("Email does not exist");
      emailError.css("display", "block");
      return false;
    } else {
      emailError.css("display", "none");
      return true;
    }
  }

  function checkLoginPassword() {
    const logPasswordValue = logPassword.val().trim();
    const logEmailValue = logEmail.val().trim();
    if (matchesPassword(logEmailValue, logPasswordValue) === false) {
      passwordError.text("Password is incorrect");
      passwordError.css("display", "block");
      return false;
    } else if (logPasswordValue === "") {
      passwordError.text("Password cannot be blank");
      passwordError.css("display", "block");
      return false;
    } else {
      emailError.css("display", "none");
      passwordError.css("display", "none");
      return true;
    }
  }

  function matchesEmail(email) {
    users = JSON.parse(localStorage.getItem("users"));
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) {
        return true;
      }
    }

    return false;
  }

  function matchesPassword(logEmail, logPassword) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == logEmail && users[i].password === logPassword) {
        return true;
      }
    }

    return false;
  }

  signupForm.on("submit", (e) => {
    e.preventDefault();
    checkName();
    checkEmail();
    checkPassword();
    checkPhone();
    checkPasswordConfirm();
    checkAgreement();
    if (
      checkName() &&
      checkEmail() &&
      checkPassword() &&
      checkPhone() &&
      checkPasswordConfirm() &&
      checkAgreement()
    ) {
      registerUser();
      window.location.href = "login.html";
    }
  });

  function windowLoad() {
    if (isLoggedIn()) {
      $(".login-link").css("display", "none");
      $(".signup-link").css("display", "none");
      $(".logout-link").css("display", "block");
      $(".user-link").css("display", "block");
      const users = JSON.parse(localStorage.getItem("users"));
      const email = localStorage.getItem("email");
      for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
          $(".user-link a").html(users[i].name);
        }
      }
    } else {
      $(".login-link").css("display", "block");
      $(".signup-link").css("display", "block");
      $(".logout-link").css("display", "none");
      $(".user-link").css("display", "none");
    }
  }

  function windowLoad2() {
    if (localStorage.getItem("shoppingCart")) {
      cart = JSON.parse(localStorage.getItem("shoppingCart"));
      cart.map((item) => {
        cartTotal += parseFloat(item.price) * item.productAmount;
        cartCount += item.productAmount;
        cartTotalDom.text("BORCUNUZ " + cartTotal.toFixed(2) + " TL");
        cartCountDom.text(cartCount);
        miniCartCountDom.text(cartCount);
        miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
      });
    }
    displayCart();
  }

  window.onload = () => {
    windowLoad();
    windowLoad2();
  };

  loginForm.on("submit", (e) => {
    e.preventDefault();
    checkLoginEmail();
    checkLoginPassword();
    if (checkLoginEmail() && checkLoginPassword()) {
      saveUser();
      window.location.href = "index.html";
    }
  });

  logout.on("click", () => {
    logoutUser();
  });
});

// LOGIN - SIGNUP PAGE
// $(document).ready(function () {
//   // SIGNUP PAGE
//   let users = [];
//   const name = $("#name");
//   const signupEmail = $("#signup-form #email");
//   const signupPassword = $("#signup-form #password");
//   const signupPasswordConf = $("#signup-form #password-conf");
//   const passwordConfError = $("#password-conf-error");
//   const nameError = $("#name-error");
//   const phone = $("#phone");
//   const phoneError = $("#phone-error");
//   const agreement = $("#agreement");
//   const agreementError = $("#agreement-error");
//   const signupForm = $("#signup-form");

//   // LOGIN PAGE
//   const togglePassword = $("#toggle-password");
//   const logPassword = $("#login-form #password");
//   const password = $("#password");

//   togglePassword.on("click", function () {
//     const type = password.attr("type") === "password" ? "text" : "password";
//     password.attr("type", type);
//     $(this).toggleClass("fa-eye-slash");
//   });

//   // INPUT VALIDATION
//   const logEmail = $("#login-form #email");
//   const loginForm = $("#login-form");
//   const emailError = $("#email-error");
//   const passwordError = $("#password-error");
//   const logout = $(".logout-link");

//   //CHECK NAME INPUT
//   function checkName() {
//     const nameValue = name.val().trim();
//     if (nameValue === "") {
//       nameError.text("Name cannot be blank");
//       nameError.css("display", "block");
//       return false;
//     } else {
//       nameError.css("display", "none");
//       return true;
//     }
//   }

//   function checkEmail() {
//     const emailValue = signupEmail.val().trim();
//     if (emailValue === "") {
//       emailError.text("Email cannot be blank");
//       emailError.css("display", "block");
//       return false;
//     } else if (!isEmail(emailValue)) {
//       emailError.text("Email format is incorrect");
//       emailError.css("display", "block");
//       return false;
//     } else if (emailExists(emailValue)) {
//       emailError.text("Email already exists");
//       emailError.css("display", "block");
//       return false;
//     } else {
//       emailError.css("display", "none");
//       return true;
//     }
//   }

//   function emailExists(emailValue) {
//     users = JSON.parse(localStorage.getItem("users"));
//     if (users) {
//       for (user of users) {
//         if (user.email === emailValue) {
//           return true;
//         }
//       }
//     } else {
//       return false;
//     }
//   }

//   function isEmail(signupEmail) {
//     return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(signupEmail);
//   }

//   function checkPassword() {
//     const passwordValue = signupPassword.val().trim();
//     if (passwordValue === "") {
//       passwordError.text("Password cannot be blank");
//       passwordError.css("display", "block");
//       return false;
//     } else if (passwordValue.length < 6) {
//       passwordError.text("Your password must be at least 6 characters");
//       passwordError.css("display", "block");
//       return false;
//     } else if (passwordValue.length > 20) {
//       passwordError.text("Your password must be less than 20 characters");
//       passwordError.css("display", "block");
//       return false;
//     } else if (!passwordValue.match(/[A-Z]/)) {
//       passwordError.text(
//         "Your password must contain at least one uppercase letter"
//       );
//       passwordError.css("display", "block");
//       return false;
//     } else if (!passwordValue.match(/[a-z]/)) {
//       passwordError.text(
//         "Your password must contain at least one lowercase letter"
//       );
//       passwordError.css("display", "block");
//       return false;
//     } else if (!passwordValue.match(/[0-9]/)) {
//       passwordError.text("Your password must contain at least one number");
//       passwordError.css("display", "block");
//       return false;
//     } else if (passwordValue.match(/\s/)) {
//       passwordError.text("Your password must not contain any spaces");
//       passwordError.css("display", "block");
//       return false;
//     } else {
//       passwordError.css("display", "none");
//       return true;
//     }
//   }

//   function checkPhone() {
//     const phoneValue = phone.val().trim();
//     if (phoneValue === "") {
//       phoneError.text("Phone cannot be blank");
//       phoneError.css("display", "block");
//       return false;
//     } else if (!isPhone(phoneValue)) {
//       phoneError.text("Phone format is incorrect");
//       phoneError.css("display", "block");
//       return false;
//     } else {
//       phoneError.css("display", "none");
//       return true;
//     }
//   }

//   function isPhone(phone) {
//     return /^(\+90|0)?[0-9]{10}$/.test(phone);
//   }

//   function checkPasswordConfirm() {
//     const passwordValue = signupPassword.val().trim();
//     const passwordConfirmValue = signupPasswordConf.val().trim();
//     if (passwordValue !== passwordConfirmValue) {
//       passwordConfError.text("Passwords do not match");
//       passwordConfError.css("display", "block");
//       return false;
//     } else {
//       passwordConfError.css("display", "none");
//       return true;
//     }
//   }

//   function checkAgreement() {
//     if (!agreement.is(":checked")) {
//       agreementError.text("You must accept the agreement");
//       agreementError.css("display", "block");
//       return false;
//     } else {
//       agreementError.css("display", "none");
//       return true;
//     }
//   }

//   function registerUser() {
//     const nameValue = name.val().trim();
//     const emailValue = signupEmail.val().trim();
//     const passwordValue = signupPassword.val().trim();
//     const phoneValue = phone.val().trim();
//     const newUser = {
//       id: users.length + 1,
//       name: nameValue,
//       email: emailValue,
//       password: passwordValue,
//       phone: phoneValue,
//     };
//     users.push(newUser);
//     localStorage.setItem("users", JSON.stringify(users));
//   }

//   function saveUser() {
//     const logEmailValue = logEmail.val().trim();
//     localStorage.setItem("email", logEmailValue);
//   }

//   function isLoggedIn() {
//     return localStorage.getItem("email") !== null;
//   }

//   function logoutUser() {
//     localStorage.removeItem("email");
//     window.location.href = "index.html";
//     $(".login-link").css("display", "block");
//     $(".signup-link").css("display", "block");
//     $(".logout-link").css("display", "none");
//     $(".user-link").css("display", "none");
//   }

//   function checkLoginEmail() {
//     const logEmailValue = logEmail.val().trim();
//     if (logEmailValue === "") {
//       emailError.text("Email cannot be blank");
//       emailError.css("display", "block");
//       return false;
//     } else if (matchesEmail(logEmailValue) === false) {
//       emailError.text("Email does not exist");
//       emailError.css("display", "block");
//       return false;
//     } else {
//       emailError.css("display", "none");
//       return true;
//     }
//   }

//   function checkLoginPassword() {
//     const logPasswordValue = logPassword.val().trim();
//     const logEmailValue = logEmail.val().trim();
//     if (matchesPassword(logEmailValue, logPasswordValue) === false) {
//       passwordError.text("Password is incorrect");
//       passwordError.css("display", "block");
//       return false;
//     } else if (logPasswordValue === "") {
//       passwordError.text("Password cannot be blank");
//       passwordError.css("display", "block");
//       return false;
//     } else {
//       emailError.css("display", "none");
//       passwordError.css("display", "none");
//       return true;
//     }
//   }

//   function matchesEmail(email) {
//     users = JSON.parse(localStorage.getItem("users"));
//     for (let i = 0; i < users.length; i++) {
//       if (users[i].email == email) {
//         return true;
//       }
//     }

//     return false;
//   }

//   function matchesPassword(logEmail, logPassword) {
//     for (let i = 0; i < users.length; i++) {
//       if (users[i].email == logEmail && users[i].password === logPassword) {
//         return true;
//       }
//     }

//     return false;
//   }

//   signupForm.on("submit", (e) => {
//     e.preventDefault();
//     checkName();
//     checkEmail();
//     checkPassword();
//     checkPhone();
//     checkPasswordConfirm();
//     checkAgreement();
//     if (
//       checkName() &&
//       checkEmail() &&
//       checkPassword() &&
//       checkPhone() &&
//       checkPasswordConfirm() &&
//       checkAgreement()
//     ) {
//       registerUser();
//       window.location.href = "login.html";
//     }
//   });

//   window.onload = () => {
//     if (isLoggedIn()) {
//       $(".login-link").css("display", "none");
//       $(".signup-link").css("display", "none");
//       $(".logout-link").css("display", "block");
//       $(".user-link").css("display", "block");
//       const users = JSON.parse(localStorage.getItem("users"));
//       const email = localStorage.getItem("email");
//       for (let i = 0; i < users.length; i++) {
//         if (users[i].email == email) {
//           $(".user-link a").html(users[i].name);
//         }
//       }

//     } else {
//       $(".login-link").css("display", "block");
//       $(".signup-link").css("display", "block");
//       $(".logout-link").css("display", "none");
//       $(".user-link").css("display", "none");
//     }
//   };

//   loginForm.on("submit", (e) => {
//     e.preventDefault();
//     checkLoginEmail();
//     checkLoginPassword();
//     if (checkLoginEmail() && checkLoginPassword()) {
//       saveUser();
//       window.location.href = "index.html";
//     }
//   });

//   logout.on("click", () => {
//     logoutUser();
//   });

// });

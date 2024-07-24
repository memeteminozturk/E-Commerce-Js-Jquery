$(() => {
  var productsDom = $(".products");
  
  $.getJSON("products.json", function (products) {
  localStorage.setItem("products", JSON.stringify(products));
  products.forEach((product) => {
    productsDom.append(`
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product">
            <div class="product-image">
                <img src="${product.image}"/>
                <div class="product-stock">Stok ${product.stock}</div>
            </div>
            <div class="product-info">
                <h2 class="product-title" title="${product.title}">${product.title}</h2>
                <p class="product-price">${product.price} TL</p>
            </div>
                <a class="btn w-100">Sepete Ekle</a>
            </div>
        </div>`);
  });
  });

  let cart = [];
  const cartDom = $(".cart .container .row .cart-items");
  const cartInfoDom = $(".cart-info-area .cart-info");
  const cartTotalDom = $(".cart-total");
  const cartCountDom = $(".cart-count");
  const miniCartDom = $(".mini-cart-content .mini-cart-items");
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
        $.notify("Ürün sepete eklendi", "success");
      } else {
        $.notify("Stokta yeterli ürün bulunmamaktadır", "error");
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
      $.notify("Ürün sepete eklendi", "success");
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
    $.notify("Ürün sepetten silindi", "error");
  }

  function displayCart() {
    if (cart.length == 0) {
      miniCartDom.html(`<h2 class="mini-cart-empty">Sepetiniz boş</h2>`);
      cartDom.html("");
      $(".mini-cart-total-section").css("display", "none");
      cartInfoDom.html(`<h2 class="cart-info-empty">Sepetiniz boş</h2>`);
      $(".coupon-area").css("display", "none");
    } else {
      $(".mini-cart-total-section").css("display", "flex");
      cartDom.html("");
      cart.map((item) => {
        productTotal = item.productAmount * item.price;
        cartDom.prepend(`
      <div class="cart-item">
      <img src="${item.image}"/>
      <h3 class="cart-item-title">${item.title}</h3>
      <p class="cart-item-quantity">
        <span class="decrease">-</span> 
        <span class="cart-item-quantity-value">${item.productAmount}</span>
        <span class="increase">+</span>
      </p>
      <p class="cart-item-price">${item.price} TL</p>
      <p class="cart-item-total">${productTotal.toFixed(2)} TL</p>
      <i class="fa fa-trash cart-item-delete"></i>
      </div>
      `);
      });

      cartInfoDom.html(`
      <h2 class="cart-info-header">Sepet Özeti</h2>
      <div class="cart-info-item">
      <p class="cart-info-title">Toplam Ürün :</p>
      <p class="cart-info-value">${cartCount}</p>
      </div>
      <div class="cart-info-item">
      <p class="cart-info-title">Toplam Tutar :</p>
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
      cartTotalDom.text("TOPLAM " + cartTotal.toFixed(2) + " TL");
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
      cartTotalDom.text("TOPLAM " + cartTotal.toFixed(2) + " TL");
      cartCountDom.text(cartCount);
      miniCartCountDom.text(cartCount);
      miniCartTotalDom.text(cartTotal.toFixed(2) + " TL");
    } else {
      $.notify("Stokta yeterli ürün bulunmamaktadır", "error");
    }
  }

  $(".mini-cart-content .mini-cart-items").on(
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

  $(".mini-cart-content .mini-cart-items").on(
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
        .replace("Stok ", ""),
    };
    addToCart(product);
    displayCart();
    saveLocalCart();
  });

  $(".mini-cart-content .mini-cart-items").on(
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

  /*****************COUPON****************** */
  const coupon = $("#coupon");
  const couponError = $(".coupon-error");
  const couponBtn = $("#coupon-btn");
  const couponInfoDom = $(".coupon-info");
  const coupons = [
    {
      code: "emin10",
      discount: 10,
    },
    {
      code: "muazzez20",
      discount: 20,
    },
    {
      code: "sümbül50",
      discount: 50,
    },
    {
      code: "test30",
      discount: 30,
    },
  ];

  function checkCoupon() {
    const couponValue = coupon.val().trim();
    if (couponValue === "") {
      couponError.text("Kupon alanı boş olamaz");
      couponError.removeClass("success");
      couponError.addClass("error");
      couponError.show();
      couponInfoDom.html("");
      return false;
    }
    for (let i = 0; i < coupons.length; i++) {
      if (couponValue === coupons[i].code) {
        couponError.css("display", "block");
        couponError.text("Kupon kodu geçerli");
        couponError.removeClass("error");
        couponError.addClass("success");
        couponInfoDom.html(
          ` <div class="cart-info-item">
            <p class="cart-info-title"> Kupon: </p>
            <p class="cart-info-value">${coupons[i].code}</p>
        </div>
        <div class="cart-info-item">
            <p class="cart-info-title"> İndirim: </p>
             <p class="cart-info-value">${coupons[i].discount}%</p>
        </div>
        <div class="cart-info-item">
            <p class="cart-info-title"> Yeni Tutar: </p>
             <p class="cart-info-value">${(
            cartTotal -
            (cartTotal * coupons[i].discount) / 100
          ).toFixed(2)}</p>
        </div>
         `
        );
        return true;
      } else {
        couponError.text("Kupon kodu geçersiz");
        couponError.css("display", "block");
        couponError.removeClass("success");
        couponError.addClass("error");
        couponInfoDom.html("");
      }
    }
  }

  couponBtn.on("click", function () {
    checkCoupon();
  });



  // ********************LOGIN PAGE***************************
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
      emailError.text("Email alanı boş olamaz");
      emailError.css("display", "block");
      return false;
    } else if (!isEmail(emailValue)) {
      emailError.text("Email formatı hatalı");
      emailError.css("display", "block");
      return false;
    } else if (emailExists(emailValue)) {
      emailError.text("Email zaten kayıtlı");
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
      passwordError.text("Şifre boş olamaz");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.length < 6) {
      passwordError.text("Şifreniz en az 6 karakter olmalıdır");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.length > 20) {
      passwordError.text("Şifreniz 20 karakterden fazla olmamalıdır");
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[A-Z]/)) {
      passwordError.text("Şifreniz en az bir büyük harf içermelidir");
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[a-z]/)) {
      passwordError.text("Şifreniz en az bir küçük harf içermelidir");
      passwordError.css("display", "block");
      return false;
    } else if (!passwordValue.match(/[0-9]/)) {
      passwordError.text("Şifreniz en az bir rakam içermelidir");
      passwordError.css("display", "block");
      return false;
    } else if (passwordValue.match(/\s/)) {
      passwordError.text("Şifreniz boşluk içermemelidir");
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
      phoneError.text("Telefon boş olamaz");
      phoneError.css("display", "block");
      return false;
    } else if (phoneValue.length < 15) {
      phoneError.text("Telefon formatı kısa");
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
      passwordConfError.text("Şifreler eşleşmiyor");
      passwordConfError.css("display", "block");
      return false;
    } else {
      passwordConfError.css("display", "none");
      return true;
    }
  }

  function checkAgreement() {
    if (!agreement.is(":checked")) {
      agreementError.text("Koşulları kabul etmelisiniz");
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
      emailError.text("Email alanı boş olamaz");
      emailError.css("display", "block");
      return false;
    } else if (matchesEmail(logEmailValue) === false) {
      emailError.text("Email adresi bulunamadı");
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
      passwordError.text("Şifre yanlış");
      passwordError.css("display", "block");
      return false;
    } else if (logPasswordValue === "") {
      passwordError.text("Şifre boş olamaz");
      passwordError.css("display", "block");
      return false;
    } else {
      emailError.css("display", "none");
      passwordError.css("display", "none");
      return true;
    }
  }

  function matchesEmail(email) {
    users = JSON.parse(localStorage.getItem("users")) || [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) {
        return true;
      }
    }

    return false;
  }

  function matchesPassword(logEmail, logPassword) {
    users = JSON.parse(localStorage.getItem("users")) || [];
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
      $.notify("Başarıyla kayıt oldunuz", "success");
      setTimeout(() => {
        registerUser();
        window.location.href = "login.html";
      }, 1500);
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

  // sayfa yüklendiğinde çalışacak fonksiyonlar
  windowLoad();
  windowLoad2();



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

  //PRODUCT INPUT FILTER

  const searchInput = $(".search-input");

  searchInput.on("input", function () {
    const searchValue = searchInput.val().trim();
    const products = JSON.parse(localStorage.getItem("products"));
    const filteredProducts = products.filter((product) => {
      return product.title.toLowerCase().includes(searchValue.toLowerCase());
    });
    displayProducts(filteredProducts);
  });

  function displayProducts(products) {
    productsDom.html("");
    products.map((product) => {
      productsDom.append(`
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product">
            <div class="product-image">
                <img src="${product.image}"/>
                <div class="product-stock">Stok ${product.stock}</div>
            </div>
            <div class="product-info">
                <h2 class="product-title" title="${product.title}">${product.title}</h2>
                <p class="product-price">${product.price} TL</p>
            </div>
                <a class="btn w-100">Sepete Ekle</a>
            </div>
        </div>`);
    });
  }

  // PHONE NUMBER MASK
  if (document.querySelector("#phone")) {
    document.getElementById("phone").addEventListener("input", function (e) {
      var x = e.target.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      e.target.value = !x[2]
        ? x[1]
        : "(" +
        x[1] +
        ") " +
        x[2] +
        (x[3] ? " " + x[3] : "") +
        (x[4] ? " " + x[4] : "");
    });
  }
});

// Typing
(function () {
  const options = {
    strings: [
      "Sau khóa học này tôi làm được gì?",
      "Cùng xem thành quả sau khóa học nhé!",
    ],
    startDelay: 5000,
    typeSpeed: 40,
    backSpeed: 10,
  };

  new Typed("#typed", options);
})();

// Get current year for copyright
(function () {
  document.querySelector("#current-year").innerText = new Date().getFullYear();

  // Clone nav to fixed-nav
  const nav = document.querySelector(".nav");
  const fixedNav = document.querySelector(".fixed-nav");
  if (nav && fixedNav) {
    fixedNav.innerHTML = nav.innerHTML;
  }
})();

// Show/hide fixed-header
(function () {
  let lastScrollTop = 0;
  const fixedHeader = document.querySelector(".fixed-header");
  const isMouseOverHeader = false;

  fixedHeader.addEventListener("mouseover", function () {
    isMouseOverHeader = true;
  });

  fixedHeader.addEventListener("mouseout", function () {
    isMouseOverHeader = false;
  });

  window.addEventListener("scroll", function (e) {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st < lastScrollTop && window.scrollY > 1400) {
      fixedHeader.classList.add("show");
    } else if (!isMouseOverHeader || window.scrollY <= 1400) {
      fixedHeader.classList.remove("show");
    }

    lastScrollTop = st <= 0 ? 0 : st;
  });
})();

// Show students bought this course.
(function () {
  // Prevent if local
  if (location.hostname === "127.0.0.1") return;

  function handleToasts(res) {
    if (window.disabledToast) return;

    const users = res.data;

    users.forEach((user) => {
      const item = document.createElement("li");

      item.className = "user-item";
      item.innerHTML = `
                        <a href="/@${user.username}" target="_blank" class="inner">
                            <img
                                class="avatar"
                                src="${user.avatar_url}"
                                alt="${user.full_name}"
                                onerror="this.src='./assets/img/blank-avatar.png'"
                            />
                            <div class="info">
                                <p class="name">
                                    ${user.full_name} vừa mua khóa học
                                </p>
                                <p class="help">(click để xem)</p>
                            </div>
                        </a>
                    `;

      document.querySelector("#bought-courses").appendChild(item);

      const removeAfter = 10000;

      setTimeout(function () {
        item.classList.add("hide");
      }, removeAfter - 500);

      setTimeout(function () {
        document.querySelector("#bought-courses").removeChild(item);
        item.remove();
      }, removeAfter);
    });
  }

  // Check out and get those who are new to this course.
  const api = `https://api-gateway.${location.hostname}/api/courses/htmlcss/user-registered`;

  function getBoughtUsers() {
    fetch(api)
      .then(function (stream) {
        return stream.json();
      })
      .then(handleToasts)
      .finally(function () {
        if (window.innerWidth >= 1024) {
          setTimeout(getBoughtUsers, getRandomInt(10000, 60000));
        }
      });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // Check out and get those who are new to this course.
  setTimeout(getBoughtUsers, getRandomInt(10000, 60000));
})();

// Check refer code
const handleRemoveReferCode = (function () {
  const url = new URL(document.location.href);
  const rf = url.searchParams.get("rf");

  if (rf) {
    Cookies.set("refer_code", rf, {
      expires: 30,
    });
  }

  // Remove refer code
  return function (user) {
    if (user.id === Number(rf)) {
      Cookies.remove("refer_code");
    }
  };
})();

(function () {
  // Prevent if local
  if (location.hostname === "127.0.0.1") return;

  const api = `https://api-gateway.${location.hostname}/api/auth/current-user`;
  fetch(api, { credentials: "include" })
    .then((stream) => stream.json())
    .then((res) => {
      const user = res.data;

      if (user) {
        handleRemoveReferCode(user);
      }
    });
})();

// Add URL params to all links
(function () {
  setTimeout(function () {
    const links = document.querySelectorAll("a[href]");

    links.forEach((link) => {
      const url = new URL(link.href);
      const entries = new URLSearchParams(window.location.search).entries();
      for (const [k, v] of entries) {
        url.searchParams.set(k, v);
      }
      link.href = url.toString();
    });
  }, 0);
})();

// Get FAQ list
(function () {
  // Prevent if local
  if (location.hostname === "127.0.0.1") return;

  const api = `https://api-gateway.${location.hostname}/api/faqs?placement=payment`;
  fetch(api)
    .then((stream) => stream.json())
    .then((res) => {
      const topics = res.data;
      const htmls = topics.map((topic, index) => {
        return `
                <h4 class="faq-topic">${topic.title}</h4>
                <ul class="faq-list">
                    ${topic.faqs
                      .map((faq, _index) => {
                        return `
                        <li class="faq-item">
                            <input type="checkbox" hidden id="target-${index}-${_index}" />
                            <label class="topic" for="target-${index}-${_index}">
                                <div class="icon">
                                    <i class="fa-solid fa-plus plus"></i>
                                    <i class="fa-solid fa-minus minus"></i>
                                </div>
                                <h3 class="title">${faq.question}</h3>
                            </label>
                            <div class="body">
                                <p>
                                ${faq.answer}
                                </p>
                            </div>
                        </li>
                        `;
                      })
                      .join("")}
                </ul>
                `;
      });

      document.querySelector("#faq-data").innerHTML = htmls.join("");
    });
})();

// Menu mobile toggle
(function () {
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.nav");
  const links = document.querySelectorAll("nav.nav a");
  const overlay = document.querySelector(".nav-overlay");

  menuBtn.onclick = function () {
    nav.classList.toggle("open", true);
    overlay.classList.toggle("open", true);
    document.body.style.overflow = "hidden";
  };

  overlay.onclick = function () {
    nav.classList.toggle("open", false);
    overlay.classList.toggle("open", false);
    document.body.style.overflow = null;
  };

  links.forEach((link) => {
    link.onclick = function () {
      overlay.click();
    };
  });
})();

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

(function () {
  const content = document.querySelector("#cdn-content");
  let timer;
  const handle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (elementIsVisibleInViewport(content)) {
        content.classList.add("build-in-animate");
      }
    }, 200);
  };

  window.onscroll = handle;
})();

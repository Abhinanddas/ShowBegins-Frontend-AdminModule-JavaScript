const apiRoute = "http://127.0.0.1:8000/api/";

document.addEventListener("load", onPageLoad());

function onPageLoad() {
  htmlTemplating();
  handleSideBarMenu();
  addScripts();
  setInterval(checkTokenExpiration, 60000);
  let urlArray = window.location.href.split("/");
  let path = urlArray[urlArray.length - 1];

  let restrictedUrls = ["login.html", "signup.html"];

  let accessToken = localStorage.access_token;
  if (accessToken) {
    if (restrictedUrls.includes(path)) {
      window.location = "dashboard.html";
    }
    return;
  }

  if (!accessToken) {
    if (!restrictedUrls.includes(path)) {
      window.location = "login.html";
    }
    return;
  }
}

function validateForm(formElements) {
  let isFormValid = true;
  for (let i = 0; i < formElements.length - 1; i++) {
    if (!formElements[i].checkValidity()) {
      isFormValid = false;
      break;
    }
  }
  return isFormValid;
}

function addToast(
  content = "",
  theme = "moon",
  time = 3000,
  autohide = true,
  position = "topRight",
  animation = "fade"
) {
  let toastr = new Toastr({
    theme: fetchToastrTheme(theme),
    position: position,
    animation: animation,
    timeout: time,
    autohide: autohide,
  });
  toastr.show(content);
}

// moon, sun, ocean, grassland, rainbow
function fetchToastrTheme(theme) {
  if (theme === "success") {
    theme = "basic";
    return theme;
  }

  if (theme === "info") {
    theme = "moon";
    return theme;
  }

  if (theme === "error") {
    theme = "sun";
    return theme;
  }

  if (theme === "warning") {
    theme = "ocean";
    return theme;
  }

  return "grassland";
}

function callGetApi(api) {
  let url = apiRoute + api;
  showLoadingScreen();
  return fetch(url, {
    method: "GET",
    headers: fetchAPIHeaders(),
  })
    .then((response) => {
      hideLoadingScreen();
      let statusCode = response.status;
      if (statusCode != 200) {
        handleAPIStatusCodes(statusCode);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch(function (response) {
      hideLoadingScreen();
      addToast("Sorry something went wrong.", "error");
      return false;
    });
}

function callPostApi(api, params) {
  let url = apiRoute + api;
  showLoadingScreen();
  return fetch(url, {
    method: "post",
    headers: fetchAPIHeaders(),
    body: JSON.stringify(params),
  })
    .then((response) => {
      hideLoadingScreen();
      let statusCode = response.status;
      if (statusCode != 200) {
        handleAPIStatusCodes(statusCode);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((response) => {
      hideLoadingScreen();
      addToast("Some error happened", "error");
      return false;
    });
}

function fetchAPIHeaders() {
  let headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    "ShowBegins-APP-Key": "base64:S2wgFrGsp81CHpMbtKV6dMjAcFakrV5b1qWPzNG5+ss=",
    "ShowBegins-APP-Secret": "SHOW_BEGINS_APP_SECRET",
  };

  if (localStorage.access_token) {
    headers.access_token = "Bearer " + localStorage.access_token;
  }
  return headers;
}

function handleAPIStatusCodes(statusCode) {
  addToast("Some error happened", "error");
}

let urlArray = window.location.href.split("/");
let path = urlArray[urlArray.length - 1];
if (path != "login.html") {
  document.getElementById("logout-button").addEventListener("click", logout);
}

function logout() {
  callPostApi("logout").then((response) => {
    if (response.status === "success") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("token_expires_at");
      window.location = "login.html";
    }
  });
}

function showLoadingScreen() {
  const spinner = document.getElementById("spinner");
  spinner.removeAttribute("hidden");
}

function hideLoadingScreen() {
  const spinner = document.getElementById("spinner");
  spinner.setAttribute("hidden", "");
}

function htmlTemplating() {
  let headerContent = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
        <link rel="icon" type="image/png" href="../assets/img/favicon.png">
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800" rel="stylesheet" />
        <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">
        <!-- Nucleo Icons -->
        <link href="../assets/css/nucleo-icons.css" rel="stylesheet" />
        <!-- CSS Files -->
        <link href="../assets/css/black-dashboard.css?v=1.0.0" rel="stylesheet" />
        <!-- CSS Just for demo purpose, don't include it in your project -->
        <link href="../assets/css/demo.css" rel="stylesheet" />
        <link href="../assets/css/toastr.css" rel="stylesheet" />
        <link href="../assets/css/common.css" rel="stylesheet" />
        <link rel="stylesheet" href="../assets/css/style.css" />
    `;

  let footerContent = ` 
            <div class="container-fluid">
            <ul class="nav">
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link">
                Creative Tim
                </a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link">
                About Us
                </a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link">
                Blog
                </a>
            </li>
            </ul>
            <div class="copyright">
            ©
            <script>
                document.write(new Date().getFullYear())
            </script>2018 made with <i class="tim-icons icon-heart-2"></i> by
            <a href="javascript:void(0)" target="_blank">Creative Tim</a> for a better web.
            </div>
            </div>`;
  let sideBarContent = `
<div class="sidebar-wrapper">
  <div class="logo">
    <a href="javascript:void(0)" class="simple-text logo-mini">
      CT
    </a>
    <a href="javascript:void(0)" class="simple-text logo-normal">
      Creative Tim
    </a>
  </div>
  <ul class="nav">
    <li class="" id="sidebar-dashboard">
      <a href="./dashboard.html">
        <i class="tim-icons icon-chart-pie-36"></i>
        <p>Dashboard</p>
      </a>
    </li>
    <li id="sidebar-add-shows">
      <a href="add-shows.html">
        <i class="tim-icons icon-atom"></i>
        <p>Add Shows</p>
      </a>
    </li>
    <li>
      <a href="movies.html">
        <i class="tim-icons icon-pin"></i>
        <p>Movies</p>
      </a>
    </li>
    <li>
      <a href="./screens.html">
        <i class="tim-icons icon-bell-55"></i>
        <p>Screens</p>
      </a>
    </li>
    <li>
      <a href="./user.html">
        <i class="tim-icons icon-single-02"></i>
        <p>User Profile</p>
      </a>
    </li>
    <li>
      <a href="./tables.html">
        <i class="tim-icons icon-puzzle-10"></i>
        <p>Table List</p>
      </a>
    </li>
    <li>
      <a href="./typography.html">
        <i class="tim-icons icon-align-center"></i>
        <p>Typography</p>
      </a>
    </li>
    <li>
      <a href="./rtl.html">
        <i class="tim-icons icon-world"></i>
        <p>RTL Support</p>
      </a>
    </li>
    <li class="active-pro">
      <a href="./upgrade.html">
        <i class="tim-icons icon-spaceship"></i>
        <p>Upgrade to PRO</p>
      </a>
    </li>
  </ul>
</div>
  `;

  let searchModalContent = `
  <div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="SEARCH">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <i class="tim-icons icon-simple-remove"></i>
      </button>
    </div>
  </div>
</div>
  `;

  let navbarContent = `
  <div class="container-fluid">
  <div class="navbar-wrapper">
    <div class="navbar-toggle d-inline">
      <button type="button" class="navbar-toggler">
        <span class="navbar-toggler-bar bar1"></span>
        <span class="navbar-toggler-bar bar2"></span>
        <span class="navbar-toggler-bar bar3"></span>
      </button>
    </div>
    <a class="navbar-brand" href="javascript:void(0)">Dashboard</a>
  </div>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation"
    aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-bar navbar-kebab"></span>
    <span class="navbar-toggler-bar navbar-kebab"></span>
    <span class="navbar-toggler-bar navbar-kebab"></span>
  </button>
  <div class="collapse navbar-collapse" id="navigation">
    <ul class="navbar-nav ml-auto">
      <li class="search-bar input-group">
        <button class="btn btn-link" id="search-button" data-toggle="modal" data-target="#searchModal"><i
            class="tim-icons icon-zoom-split"></i>
          <span class="d-lg-none d-md-block">Search</span>
        </button>
      </li>
      <li class="dropdown nav-item">
        <a href="javascript:void(0)" class="dropdown-toggle nav-link" data-toggle="dropdown">
          <div class="notification d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-sound-wave"></i>
          <p class="d-lg-none">
            Notifications
          </p>
        </a>
        <ul class="dropdown-menu dropdown-menu-right dropdown-navbar">
          <li class="nav-link"><a href="#" class="nav-item dropdown-item">Mike John responded to your email</a>
          </li>
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">You have 5 more
              tasks</a></li>
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">Your friend Michael
              is in town</a></li>
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">Another
              notification</a></li>
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">Another one</a></li>
        </ul>
      </li>
      <li class="dropdown nav-item">
        <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
          <div class="photo">
            <img src="../assets/img/anime3.png" alt="Profile Photo">
          </div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">
            Log out
          </p>
        </a>
        <ul class="dropdown-menu dropdown-navbar">
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">Profile</a></li>
          <li class="nav-link"><a href="javascript:void(0)" class="nav-item dropdown-item">Settings</a></li>
          <li class="dropdown-divider"></li>
          <li class="nav-link"><a class="nav-item dropdown-item" href='#' id="logout-button">Log out</a></li>
        </ul>
      </li>
      <li class="separator d-lg-none"></li>
    </ul>
  </div>
</div>
  `;

  document.head.innerHTML = document.head.innerHTML + headerContent;
  document.querySelector("footer").innerHTML = footerContent;
  document.getElementById("sidebar").innerHTML = sideBarContent;
  document.getElementById("searchModal").innerHTML = searchModalContent;
  document.getElementById("navbar").innerHTML = navbarContent;
}

function handleSideBarMenu() {
  let urlArray = window.location.href.split("/");

  var sideBar = {
    "dashboard.html": "sidebar-dashboard",
    "add-shows.html": "sidebar-add-shows",
  };

  for (let key in sideBar) {
    if (urlArray.includes(key)) {
      document.getElementById(sideBar[key]).className += "active";
    }
  }
}

function addScripts() {
  let scriptUrls = [
    "../assets/js/core/popper.min.js",
    "../assets/js/core/bootstrap.min.js",
    "../assets/js/plugins/perfect-scrollbar.jquery.min.js",
    "../assets/js/plugins/chartjs.min.js",
    "../assets/js/plugins/bootstrap-notify.js",
    "../assets/js/black-dashboard.min.js?v=1.0.0",
    "../assets/js/toastr.js",
  ];

  for (let url in scriptUrls) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptUrls[url];
    document.body.appendChild(script);
  }
}

function checkTokenExpiration() {
  let tokexExpiresAt = new Date(localStorage.token_expires_at);
  let now = new Date();

  let timeDiffInSeconds = Math.abs(tokexExpiresAt - now) / 1000;

  if (timeDiffInSeconds < 0) {
    logout();
    return;
  }

  if(timeDiffInSeconds < 3600){
    refreshAccessToken();
  }

}

function refreshAccessToken(){
  let params = {
    'refresh_token':localStorage.refresh_token,
  };
  callPostApi('get-referesh-token', params).then(response=>{
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    let date = new Date(response.data.token_expires_at.date);
    localStorage.setItem('token_expires_at', date);
  })
}

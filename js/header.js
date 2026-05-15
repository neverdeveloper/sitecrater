function loadeHeader() {
  const token = localStorage.getItem('token');
  const authButtons = token 
    ? `<a href="/cabinet" class="btn btn-ghost"> <span data-lang="btn_cabinet">Cabinet</span></a>`
    : `<a href="../" class="btn btn-ghost" onclick="openModal('signin'); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_signin">Sign In</span></a>
       <a href="../" class="btn btn-primary" onclick="openModal('signup'); return false;"><i class="fa-regular fa-user"></i> <span data-lang="btn_signup">Sign Up</span></a>`;

  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../" class="active"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                ${authButtons}
            </div>
        </div>
    </nav>
  `;
  
  const container = document.getElementById('header-container');
  if (container) container.innerHTML = headerHTML;
}

function loadeHeaderProduct() {
  const token = localStorage.getItem('token');
  const authButtons = token 
    ? `<a href="/cabinet" class="btn btn-ghost"> <span data-lang="btn_cabinet">Cabinet</span></a>`
    : `<a href="../" class="btn btn-ghost" onclick="openModal('signin'); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_signin">Sign In</span></a>
       <a href="../" class="btn btn-primary" onclick="openModal('signup'); return false;"><i class="fa-regular fa-user"></i> <span data-lang="btn_signup">Sign Up</span></a>`;

  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product" class="active"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                ${authButtons}
            </div>
        </div>
    </nav>
  `;
  
  const container = document.getElementById('header-container-product');
  if (container) container.innerHTML = headerHTML;
}


function loadeHeaderCabinet() {
  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                <a href="#" class="btn btn-ghost" onclick="handleLogout(); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_logout">Exit</span></a>
            </div>
        </div>
    </nav>
  `;
  
  const container = document.getElementById('header-container-cabinet');
  if (container) container.innerHTML = headerHTML;
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../';
}

function loadeHeaderTerm() {
  const token = localStorage.getItem('token');
  const authButtons = token 
    ? `<a href="/cabinet" class="btn btn-ghost"> <span data-lang="btn_cabinet">Cabinet</span></a>`
    : `<a href="../" class="btn btn-ghost" onclick="openModal('signin'); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_signin">Sign In</span></a>`;

  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula" class="active"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                ${authButtons}
            </div>
        </div>
    </nav>
  `;
  
  const container = document.getElementById('header-container-home');
  if (container) container.innerHTML = headerHTML;
}

function loadeHeaderProduct() {
  const token = localStorage.getItem('token');
  const authButtons = token 
    ? `<a href="/cabinet" class="btn btn-ghost"> <span data-lang="btn_cabinet">Cabinet</span></a>`
    : `<a href="../" class="btn btn-ghost" onclick="openModal('signin'); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_signin">Sign In</span></a>
       <a href="../" class="btn btn-primary" onclick="openModal('signup'); return false;"><i class="fa-regular fa-user"></i> <span data-lang="btn_signup">Sign Up</span></a>`;

  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product" class="active"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                ${authButtons}
            </div>
        </div>
    </nav>
  `;
  
  document.getElementById('header-container-product').innerHTML = headerHTML;
}


function loadeHeaderCabinet() {
  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                <a href="#" class="btn btn-ghost" onclick="handleLogout(); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_logout">Exit</span></a>
            </div>
        </div>
    </nav>
  `;
  
  document.getElementById('header-container-cabinet').innerHTML = headerHTML;
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../';
}

function loadeHeaderTerm() {
  const token = localStorage.getItem('token');
  const authButtons = token 
    ? `<a href="/cabinet" class="btn btn-ghost"> <span data-lang="btn_cabinet">Cabinet</span></a>`
    : `<a href="../" class="btn btn-ghost" onclick="openModal('signin'); return false;"><i class="fa-solid fa-right-to-bracket"></i> <span data-lang="btn_signin">Sign In</span></a>`;

  const headerHTML = `
       <nav>
<a href="../" class="nav-left">
    <div class="logo">
        <span class="client-name"></span>
    </div>
</a>

        <div class="nav-right">
            <div class="nav-links">
                <a href="../"><i class="fa-solid fa-house"></i> <span data-lang="nav_home">Home</span></a>
                <a href="../product"><i class="fa-solid fa-box"></i> <span data-lang="nav_products">Products</span></a>
                <a href="../eula" class="active"><i class="fa-solid fa-scale-balanced"></i> <span data-lang="nav_terms">Eula</span></a>
            </div>
            <div class="lang-switcher">
                <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
                <button class="lang-btn" onclick="setLanguage('ru')">RU</button>
            </div>
            <div class="auth-buttons">
                ${authButtons}
            </div>
        </div>
    </nav>
  `;
  
  document.getElementById('header-container-home').innerHTML = headerHTML;
}

document.addEventListener('DOMContentLoaded', loadeHeaderTerm);
document.addEventListener('DOMContentLoaded', loadeHeaderCabinet);
document.addEventListener('DOMContentLoaded', loadeHeader);
document.addEventListener('DOMContentLoaded', loadeHeaderProduct);
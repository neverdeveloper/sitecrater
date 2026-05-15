function loadFooter() {
  const footerHTML = `
    <footer>
        <div class="footer-content">

            <div class="footer-brand">
                <div class="footer-logo">
                    <span class="client-name"></span>
                </div>

                <p class="footer-description" data-lang="footer_description">
                    The ultimate gaming enhancement solution. Elevate your gameplay with powerful features and undetectable bypasses.
                </p>

                <div class="footer-socials">
                    <a href="#" class="social-link discord-link" title="Discord">
                        <i class="fa-brands fa-discord"></i>
                    </a>
                    <a href="#" class="social-link telegram-link" title="Telegram">
                        <i class="fa-brands fa-telegram"></i>
                    </a>
                </div>
            </div>

            <div class="footer-column">
                <h4 data-lang="footer_navigation">Navigation</h4>
                <div class="footer-links">
                    <a href="../">
                        <i class="fa-solid fa-house"></i>
                        <span data-lang="nav_home">Home</span>
                    </a>
                    <a href="../product">
                        <i class="fa-solid fa-box"></i>
                        <span data-lang="nav_products">Products</span>
                    </a>
                    <a href="../cabinet">
                        <i class="fa-solid fa-download"></i>
                        <span data-lang="footer_download">Download</span>
                    </a>
                </div>
            </div>

            <div class="footer-column">
                <h4 data-lang="footer_support">Support</h4>
                <div class="footer-links">
                    <a href="../eula">
                        <i class="fa-solid fa-circle-question"></i>
                        <span data-lang="footer_faq">EULA</span>
                    </a>
                </div>
            </div>

        </div>

        <div class="footer-bottom">
            <p class="footer-copyright">
                © 2026-2027 <span class="client-name"></span>.
                <span data-lang="footer_rights">All rights reserved.</span>
            </p>
        </div>
    </footer>
  `;

  document.getElementById('footer-container').innerHTML = footerHTML;

  document.querySelectorAll('.client-name').forEach(el => {
    el.textContent = CONFIG.clientName || '';
  });

  const discord = document.querySelector('.discord-link');
  if (discord && CONFIG.discordLink) {
    discord.href = CONFIG.discordLink;
    discord.target = "_blank";
  } else if (discord) {
    discord.style.display = "none";
  }

  const telegram = document.querySelector('.telegram-link');
  if (telegram && CONFIG.telegramLink) {
    telegram.href = CONFIG.telegramLink;
    telegram.target = "_blank";
  } else if (telegram) {
    telegram.style.display = "none";
  }


  const contact = document.querySelector('.contact');
  if (contact && CONFIG.telegramLink) {
    contact.href = CONFIG.telegramLink;
    contact.target = "_blank";
  } else if (contact) {
    contact.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', loadFooter);

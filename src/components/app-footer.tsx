import { socialLinks } from "@/lib/data";

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target={social.url.startsWith("mailto:") ? undefined : "_blank"}
            rel={
              social.url.startsWith("mailto:")
                ? undefined
                : "noopener noreferrer"
            }
          >
            {social.name}
          </a>
        ))}
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Daniel Yi</p>
    </footer>
  );
}

const griefBarStyles = `
  .grief-support-bar {
    background: rgba(138,158,140,0.12);
    border-top: 1px solid rgba(138,158,140,0.25);
    padding: 14px 24px;
    text-align: center;
  }
  .grief-support-bar p {
    font-size: 0.78rem; font-weight: 400;
    color: rgba(26,26,26,0.55); line-height: 1.7;
    font-family: 'Cormorant Garamond', serif; font-style: italic;
  }
  .grief-support-bar a {
    color: #6b9e6e; text-decoration: none; font-weight: 500;
    font-style: normal; border-bottom: 1px solid rgba(107,158,110,0.35);
    transition: color 0.2s;
  }
  .grief-support-bar a:hover { color: #4a7d4d; }
`;

export default function GriefSupportBar() {
  return (
    <>
      <style>{griefBarStyles}</style>
      <div className="grief-support-bar">
        <p>
          If you're finding this difficult, you're not alone. Professional grief support is available.{" "}
          <a href="https://www.camh.ca/en/health-info/crisis-resources"
             target="_blank" rel="noopener noreferrer">
            Crisis Services Canada
          </a>
          : 1‑833‑456‑4566 &nbsp;·&nbsp;{" "}
          <a href="https://www.counsellingbc.com/grief-counselling/"
             target="_blank" rel="noopener noreferrer">
            Find a grief counsellor
          </a>
        </p>
      </div>
    </>
  );
}
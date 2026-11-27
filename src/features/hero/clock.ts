const TIME_ZONE = 'Asia/Amman';
const REFRESH_MS = 10_000;

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});

export function startAmmanClock(target: HTMLTimeElement): void {
  const render = () => {
    const now = new Date();
    target.textContent = formatter.format(now);
    target.dateTime = now.toISOString();
  };
  render();
  setInterval(render, REFRESH_MS);
}

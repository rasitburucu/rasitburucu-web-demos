// Gelidonya: the plastic name stake pushed into the order tray (2D canvas).
// The tray itself is drawn from renders: lib/gelidonya/viyol-kare.ts.

type C = CanvasRenderingContext2D;

/** The plastic name stake pushed into the tray. */
export function drawStake(cx: C, x: number, y: number, s: number, text: string, font: string) {
  cx.save();
  cx.translate(x, y);
  cx.rotate(-0.18);
  cx.shadowColor = "rgba(0,0,0,.35)";
  // light from the upper left, as in the renders
  cx.shadowBlur = 6;
  cx.shadowOffsetX = 4;
  cx.shadowOffsetY = 5;
  cx.fillStyle = "#FBFBF7";
  cx.font = `800 ${Math.round(s * 0.36)}px ${font}`;
  const tw = cx.measureText(text).width;
  const W = Math.max(s * 2.4, tw + s * 0.34);
  cx.beginPath();
  cx.moveTo(0, 0);
  cx.lineTo(W, 0);
  cx.lineTo(W, s * 0.62);
  cx.lineTo(0, s * 0.62);
  cx.closePath();
  cx.fill();
  cx.shadowColor = "transparent";
  cx.fillStyle = "#111311";
  cx.textBaseline = "middle";
  cx.fillText(text, s * 0.16, s * 0.33);
  cx.restore();
}

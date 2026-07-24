/* ============================================================
   Mobile nav toggle
============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   GROWTH CHART
   UPDATE ME: add a new entry here whenever your role changes.
   y = 0 (junior) to 100 (senior) — just controls chart height.
   Set projected: true for a role you haven't started yet
   (renders as a dashed, hollow point).
============================================================ */
const milestones = [
  { year: "2016", role: "Student Teacher", y: 6 },
  { year: "2018", role: "Intervention Specialist", y: 30 },
  { year: "2021", role: "M.Ed., Special Ed.", y: 50 },
  { year: "2022", role: "Diverse Learners Teacher", y: 68 },
  { year: "2023", role: "Case Manager, BHT Lead", y: 86 },
  { year: "Next", role: "School Administrator", y: 100, projected: true }
];

(function drawChart(){
  const svg = document.getElementById('growthChart');
  const ns = "http://www.w3.org/2000/svg";

  const W = 680, H = 400;
  const padX = 34, padTop = 60, padBottom = 56;
  const n = milestones.length;
  const usableH = H - padTop - padBottom;
  const stepX = (W - padX * 2) / (n - 1);

  const pts = milestones.map((m, i) => ({
    ...m,
    x: padX + i * stepX,
    y: padTop + usableH * (1 - m.y / 100)
  }));

  const frag = document.createDocumentFragment();

  // baseline grid lines
  [0.25, 0.5, 0.75].forEach(f => {
    const gl = document.createElementNS(ns, "line");
    gl.setAttribute("x1", padX); gl.setAttribute("x2", W - padX);
    const gy = padTop + usableH * f;
    gl.setAttribute("y1", gy); gl.setAttribute("y2", gy);
    gl.setAttribute("stroke", "#DED6BF");
    gl.setAttribute("stroke-width", "1");
    frag.appendChild(gl);
  });

  function pathFrom(points){
    return points.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");
  }

  const solidPts = pts.filter(p => !p.projected);
  const lastSolid = solidPts[solidPts.length - 1];
  const projectedPt = pts.find(p => p.projected);

  // solid path (actual history)
  const solidPath = document.createElementNS(ns, "path");
  solidPath.setAttribute("d", pathFrom(solidPts));
  solidPath.setAttribute("fill", "none");
  solidPath.setAttribute("stroke", "#5F7A5A");
  solidPath.setAttribute("stroke-width", "3");
  solidPath.setAttribute("stroke-linecap", "round");
  solidPath.setAttribute("stroke-linejoin", "round");
  frag.appendChild(solidPath);

  // dashed path (projected next step)
  if (projectedPt){
    const dashPath = document.createElementNS(ns, "path");
    dashPath.setAttribute("d", pathFrom([lastSolid, projectedPt]));
    dashPath.setAttribute("fill", "none");
    dashPath.setAttribute("stroke", "#C08A1E");
    dashPath.setAttribute("stroke-width", "3");
    dashPath.setAttribute("stroke-linecap", "round");
    dashPath.setAttribute("stroke-dasharray", "2 7");
    frag.appendChild(dashPath);
  }

  // word-wrap a label into short lines so it never runs into its neighbor
  function wrapLabel(text, maxChars){
    const words = text.split(" ");
    const lines = [];
    let current = "";
    words.forEach(w => {
      const candidate = current ? current + " " + w : w;
      if (candidate.length > maxChars && current){
        lines.push(current);
        current = w;
      } else {
        current = candidate;
      }
    });
    if (current) lines.push(current);
    return lines;
  }

  const LINE_H = 13;
  const CHAR_W = 6.2; // approx width of an IBM Plex Mono char at 10.5px

  pts.forEach((p) => {
    const anchor = p.x < 70 ? "start" : (p.x > W - 70 ? "end" : "middle");
    const lines = wrapLabel(p.role, 15);

    // label sits directly above the point; taller blocks (2 lines) start higher
    // so the LAST line always lands at the same fixed distance from the dot —
    // this keeps every label the same distance from its own point regardless
    // of how many lines it wraps to.
    const bottomY = p.y - 16;
    const topY = bottomY - (lines.length - 1) * LINE_H;

    // background chip so text stays legible over grid lines / the plotted line
    const widest = Math.max(...lines.map(l => l.length)) * CHAR_W;
    const chipW = widest + 14;
    const chipH = lines.length * LINE_H + 8;
    const chipX = anchor === "start" ? p.x - 6
                : anchor === "end"   ? p.x - chipW + 6
                : p.x - chipW / 2;
    const chipY = topY - LINE_H + 2;

    const chip = document.createElementNS(ns, "rect");
    chip.setAttribute("x", chipX);
    chip.setAttribute("y", chipY);
    chip.setAttribute("width", chipW);
    chip.setAttribute("height", chipH);
    chip.setAttribute("rx", 5);
    chip.setAttribute("class", "label-chip");
    frag.appendChild(chip);

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", p.x);
    text.setAttribute("text-anchor", anchor);
    text.setAttribute("class", "node-label");
    lines.forEach((line, i) => {
      const tspan = document.createElementNS(ns, "tspan");
      tspan.setAttribute("x", p.x);
      tspan.setAttribute("y", topY + i * LINE_H);
      tspan.textContent = line;
      text.appendChild(tspan);
    });
    frag.appendChild(text);

    // point marker
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", p.projected ? 6 : 5.5);
    circle.setAttribute("fill", p.projected ? "#FBF9F4" : "#5F7A5A");
    circle.setAttribute("stroke", p.projected ? "#C08A1E" : "#5F7A5A");
    circle.setAttribute("stroke-width", p.projected ? 2.5 : 0);
    if (p.projected) circle.setAttribute("stroke-dasharray", "2 3");
    frag.appendChild(circle);

    // year, below the axis
    const yearLabel = document.createElementNS(ns, "text");
    yearLabel.setAttribute("x", p.x);
    yearLabel.setAttribute("y", H - padBottom + 26);
    yearLabel.setAttribute("text-anchor", anchor);
    yearLabel.setAttribute("class", "node-year");
    yearLabel.textContent = p.year;
    frag.appendChild(yearLabel);
  });

  svg.appendChild(frag);

  // animate the solid line drawing in (skipped for reduced-motion users)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && solidPath.getTotalLength){
    const len = solidPath.getTotalLength();
    solidPath.style.strokeDasharray = len;
    solidPath.style.strokeDashoffset = len;
    solidPath.style.transition = "stroke-dashoffset 1.4s ease";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      solidPath.style.strokeDashoffset = "0";
    }));
  }
})();

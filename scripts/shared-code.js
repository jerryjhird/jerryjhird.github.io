function spawnfallobj() {
    const el = document.createElement("div");
    el.className = "fallobj-face";

    const item = window.fallItems[
        Math.floor(Math.random() * window.fallItems.length)
    ];

    el.textContent = item;

    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 1.5 + Math.random() * 2 + "rem";
    el.style.animationDuration = 6 + Math.random() * 6 + "s";
    el.style.setProperty("--rot", `${Math.random() * 40 - 20}deg`);

    document.querySelector(".fallobj-bg").appendChild(el);

    setTimeout(() => el.remove(), 15000);
}
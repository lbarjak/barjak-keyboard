let mobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
    window.location.href = "keyboard.html";
}
window.onload = function () {
    const btn = document.querySelector('#btn');
    btn.onclick = function () {
        const inst = document.querySelectorAll('input[name="instrument"]');
        let selectedInst;
        for (const ins of inst) {
            if (ins.checked) {
                selectedInst = ins.value;
                break;
            }
        }
        const rbs = document.querySelectorAll('input[name="rows"]');
        let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }
        window.location.href = "keyboard.html?rows=" + selectedValue + "&inst=" + selectedInst;
    };
}
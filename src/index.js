export default class IndexJS {
    menu() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
        ) {
            window.location.href = 'keyboard.html'
        }
        const btn = document.querySelector('#btn')
        console.log("btn: ", btn)
        btn.onclick = function () {
            const inst = document.querySelectorAll('input[name="instrument"]')
            let selectedInst
            for (const ins of inst) {
                if (ins.checked) {
                    selectedInst = ins.value
                    break
                }
            }
            const rbs = document.querySelectorAll('input[name="rows"]')
            let selectedValue
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value
                    break
                }
            }
            window.location.href =
                'keyboard.html?rows=' + selectedValue + '&inst=' + selectedInst
        }
    }
}

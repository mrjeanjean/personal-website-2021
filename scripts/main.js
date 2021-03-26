import './../styles/main.scss'

// SEE WORKS
//-----------------------------
const seeWorksButtons = document.querySelectorAll(".js-see-works-button");

seeWorksButtons.forEach($button=>{
   const buttonID = $button.getAttribute("data-works-button");
   const $worksPanel = document.querySelector(`[data-works-id="${buttonID}"]`);

    $button.addEventListener("click", ()=>{
        $worksPanel.classList.toggle("active");
    })
});

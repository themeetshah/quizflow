// Initialize first section
activateSection(currentSectionIndex);

// Add event listener for mouse wheel scroll
window.addEventListener('wheel', handleScroll);

window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;

    var brEle = document.getElementsByClassName("br");

    // Get elements
    const txt = document.getElementsByClassName("carousel_text");
    const img1_div = document.getElementById("car_img_div_1");
    const des1 = document.getElementById("car_des_div_1");
    const img2_div = document.getElementById("car_img_div_2");
    const des2 = document.getElementById("car_des_div_2");
    const img1 = document.getElementById("car_img_1");
    const img2 = document.getElementById("car_img_2");
    const img3 = document.getElementById("abt_img");
    const img3_div = document.getElementById("abt_img_div");
    const des3 = document.getElementById("abt_text_div");

    // Apply the dynamic changes when width is 768px or larger
    if (width >= 768) {
        // Check if the difference between height and width is between 240 and 500
        if (height > width) {
            // For the condition where height and width difference is between 240 and 500
            img1_div.classList.remove('col-md-5', 'order-md-2');
            img1_div.classList.add('col-12', 'order-1');
            des1.classList.remove('col-md-7', 'order-md-1');
            des1.classList.add('col-12', 'order-2');

            img2_div.classList.remove('col-md-5', 'order-md-2');
            img2_div.classList.add('col-12', 'order-1');
            des2.classList.remove('col-md-7', 'order-md-1');
            des2.classList.add('col-12', 'order-2');

            img3_div.classList.remove('col-md-6');
            img3_div.classList.add('col-12');
            des3.classList.remove('col-md-6');
            des3.classList.add('col-12');

            img1.classList.remove("w-75") //75
            img2.classList.remove("w-75")
            img3.classList.remove("w-50")
            img1.classList.add("w-50")
            img2.classList.add("w-50")
            img3.classList.add("w-50")

            for (let i = 0; i < txt.length; i++) {
                txt[i].classList.remove("mt-5");
            }
        } else {
            img1_div.classList.remove('col-12', 'order-1');
            img1_div.classList.add('col-md-5', 'order-md-2');
            des1.classList.remove('col-12', 'order-2');
            des1.classList.add('col-md-7', 'order-md-1');

            img2_div.classList.remove('col-12', 'order-1');
            img2_div.classList.add('col-md-5', 'order-md-2');
            des2.classList.remove('col-12', 'order-2');
            des2.classList.add('col-md-7', 'order-md-1');

            img3_div.classList.remove('col-12');
            img3_div.classList.add('col-md-6');
            des3.classList.remove('col-12');
            des3.classList.add('col-md-6');

            img1.classList.remove("w-50")
            img2.classList.remove("w-50")
            img3.classList.remove("w-50")
            img1.classList.add("w-75") //75
            img2.classList.add("w-75")
            img3.classList.add("w-50")

            for (let i = 0; i < txt.length; i++) {
                txt[i].classList.add("mt-5");
            }
        }
    } else {
        // Reset for smaller screens (under 768px)
        img1_div.classList.remove('col-12', 'order-1');
        img1_div.classList.add('col-md-5', 'order-md-2');
        des1.classList.remove('col-12', 'order-2');
        des1.classList.add('col-md-7', 'order-md-1');

        img2_div.classList.remove('col-12', 'order-1');
        img2_div.classList.add('col-md-5', 'order-md-2');
        des2.classList.remove('col-12', 'order-2');
        des2.classList.add('col-md-7', 'order-md-1');

        img3_div.classList.remove('col-12');
        img3_div.classList.add('col-md-6');
        des3.classList.remove('col-12');
        des3.classList.add('col-md-6');

        img1.classList.remove("w-75") //75
        img2.classList.remove("w-75")
        img3.classList.remove("w-50")
        img1.classList.add("w-50")
        img2.classList.add("w-50")
        img3.classList.add("w-50")

        for (let i = 0; i < txt.length; i++) {
            txt[i].classList.remove("mt-5");
        }
    }
    updateBrAndH2DisplayClass();

    function updateBrAndH2DisplayClass() {
        if (brEle.length > 0) {
            var screenWidth = window.innerWidth;

            brEle[0].classList.remove("d-none");

            if (screenWidth < 768) {
                brEle[0].classList.add("d-none");
            }
        }
    }
});

// Trigger resize event on page load to set the correct order
window.dispatchEvent(new Event('resize'));
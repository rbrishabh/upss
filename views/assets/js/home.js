
$(document).ready(function () {
    var imgs = document.getElementById('martyrImage').getElementsByTagName('img');
    var curImg = null;
    for(var i = 0; i < imgs .length; i++) {
        curImg = imgs[i];
        console.log(curImg.classList[1]);
        $("." + curImg.classList[1]).attr("src", "getMartyrImage?imageId=" + curImg.id);
    }


    var imgs1 = document.getElementById('homageImage').getElementsByTagName('img');
    var curImg1 = null;

    for(var i = 0; i < imgs1 .length; i++) {
        curImg1 = imgs1[i];
        $("."+curImg1.classList[2]).attr("src", "getHomageImage?imageId="+curImg1.id);

    }


    var imgs2 = document.getElementById('achieverImg').getElementsByTagName('img');
    var curImg2 = null;

    for(var i = 0; i < imgs2 .length; i++) {
        curImg2 = imgs2[i];
        $("."+curImg2.classList[3]).attr("src", "getAchieverImage?imageId="+curImg2.id);

    }


});


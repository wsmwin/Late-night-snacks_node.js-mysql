var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'dnsdudrhk1@',
    database:'diary'
  });
  db.connect();
module.exports = {
  HTML:function(title, sectionPicture, banner, page){   // 기본적인 틀 템플릿(제목과, section사진, 베너와 page에 대한 내용 받아서 보여주기)
    return `
    <!-- 템플릿 시작 -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <!-- Required Meta Tags -->
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
        <!-- Page Title -->
        <title>${title}</title>
    
        <!-- Favicon -->
        <link rel="shortcut icon" href="http://kookmingps.cafe24.com/diary/assets/images/logo/favicon.png" type="image/x-icon">
    
        <!-- CSS Files -->
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/css/animate-3.7.0.css">
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/fonts/flat-icon/flaticon.css">
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/css/bootstrap-4.1.3.min.css">
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/css/owl-carousel.min.css">
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/css/nice-select.css">
        <link rel="stylesheet" href="http://kookmingps.cafe24.com/diary/assets/css/style.css">
        <link rel="stylesheet" href="http://fonts.googleapis.com/earlyaccess/hanna.css">
    </head>
    <body>
        <!-- Preloader Starts -->
        <div class="preloader">
            <div class="spinner"></div>
        </div>
        <!-- Preloader End -->
    
        <!-- Header Area Starts -->
      <header class="header-area header-area2">
            <div class="container">
                <div class="row">
                    <div class="col-lg-2">
                        <div class="logo-area">
                        </div>
                    </div>
                    <div class="col-lg-10">
                        <div class="custom-navbar">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="main-menu main-menu2">
                            <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/menu">Menu</a></li>
                            <li><a href="/diary">Diary</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    
        ${sectionPicture}
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        ${banner}
                    </div>
                </div>
            </div>
        </section>
    <!-- 템플릿 베너까지 끝 -->
              ${page}
        <!-- Javascript -->
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/jquery-2.2.4.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/bootstrap-4.1.3.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/wow.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/owl-carousel.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/jquery.datetimepicker.full.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/vendor/jquery.nice-select.min.js"></script>
        <script src="http://kookmingps.cafe24.com/diary/assets/js/main.js"></script>
    </body>
    </html>
    `;
    }, list:function(menuList){                 // menu 화면 받아온 것 뿌려주기
        var list = '';
        var i = 0;
        while(i < menuList.length){
            list = list + `
            <div class="col-md-4 col-sm-6">
                <div class="single-food mt-5">
                    <div class="food-img">
                        <img src="${menuList[i].mPicture}" class="img-fluid" alt="">
                    </div>
                    <div class="food-content">
                        <div class="d-flex justify-content-between">
                            <h5>${menuList[i].mName}</h5>
                            <span class="style-change">￦${menuList[i].mPrice}</span>
                        </div>
                        <p class="pt-3">${menuList[i].mDescription}</p>
                    </div>
                </div>
            </div>
            `;
        i = i + 1;
        };
        return list;
    }, diaryList: function(diaryList, menuL){       // diary 화면 받아온 것 뿌려주기
        var list = ``;
        var i = 0;
        while(i < diaryList.length){
            list = list + `
            <div class="table-row">
            <div class="serial">${diaryList[i].dId}</div>
            <div class="visit">${diaryList[i].dTitle}</div>
            <div class="visit">${diaryList[i].dDesc}</div>
            ${menuL[i]}
            <div class="visit">${diaryList[i].mMany}</div>
            <div class="visit">${diaryList[i].oPrice}</div>
            <div class="country">${diaryList[i].dTime.toLocaleString()}</div>
            </div>
            `;
            i++;            
        };
        return list;
    }, menuHTML: function(dId){                 // diary에서 menu Id를 통해 menu table과 join해서 해당하는 diary Id에 맞는 값들을 가져와서 뿌려주는 것
        return new Promise(function(resolve, reject){
            db.query('select mName, mPicture from menu join diary on menu.mId = diary.mId where diary.dId=?',[dId], function(error, menu){
                var menuName = menu[0].mName;
                var menuPicture = menu[0].mPicture;
                var html = `<div class="country" style="width:430px;"><img src="${menuPicture}" width="50" height="50">${menuName}</div>`;
                resolve(html);
            });
        });
    }, menuSelect:function(menuList, mIndex){   // menu를 고르는 select문 만들어주는 template(update diary의 경우 기존 값 가져오기 위해 파라미터 있다)
        var tag = '';
        var i = 0;
        while(i < menuList.length){
            if(mIndex-1 == i){
                tag += `<option value="${menuList[i].mId}" selected>${menuList[i].mName}</option>`
            } else {
                tag += `<option value="${menuList[i].mId}">${menuList[i].mName}</option>`
            }
            i++;
        }
        return `
        <div class="input-group-icon mt-10">
            <div class="form-select" id="default-select"><select name="menuSelect">
                ${tag}
            </select></div>
        </div>
        `;
    }, manySelect:function(mMany){              // menu 수량을 고르는 select문 만들어주는 template(update diary의 경우 기존 값 가져오기 위해 파라미터 있다)
        var tag ='';
        var i = 0;
        while(i < 10){
            if(mMany == i){
                tag += `<option value="${i}" selected>${i}</option>`
            } else {
                tag += `<option value="${i}">${i}</option>`
            }
            i++;
        }
        return `
        <div class="input-group-icon mt-10">
            <div class="form-select" id="default-select"><select name="manySelect">
                ${tag}
            </select></div>
        </div>
        `;
    }, diarySelect:function(diaryList){         // diary화면에서 수정과 삭제할 다이어리 번호를 고르는 select문 만들어주기
        var tag ='';
        var i = 0;
        while(i < diaryList.length){
            tag += `<option value="${diaryList[i].dId}">${diaryList[i].dId} 번</option>`
            i++;
        }
        return `
           <select class="default-select2" id="selectDiary" name="diarySelect">
                ${tag}
            </select>
        `;
    }
}

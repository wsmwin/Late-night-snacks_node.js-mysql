var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var mysql = require('mysql');
// db에 대한 부분 추가
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'dnsdudrhk1@',
  database:'diary'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){                         // 초기 홈화면 보여주기
          var title = '우승민의 야식 다이어리';
          var sectionPicture =`<section class="banner-area text-center">`
          var banner = `<p class="tit">우승민의<br><span class="prime-color">야식 다이어리~</span></p>`
          var page = `
          <section class="welcome-area section-padding2">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-6 align-self-center">
                  <div class="welcome-img">
                    <img src="http://kookmingps.cafe24.com/diary/pizza1.png" class="img-fluid" alt="">
                  </div>
              </div>
              <div class="col-md-6 align-self-center">
                  <div class="welcome-text mt-5 mt-md-0">
                    <h4><span class="style-change">배달의민족</span></h4>
                    <p>총 주문금액 보기에서<br>영감을 받았습니다.</p><br>
                    <a href="/menu" class="template-btn mt-3 mm">메뉴 보러가기</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          `;
          var html = template.HTML(title, sectionPicture, banner, page);
          response.writeHead(200);
          response.end(html);
      } else if(pathname === '/menu'){            // 메뉴화면 보여주기(db에 저장된 데이터 바탕으로 가져오기)
        var title = '우승민의 메뉴';
        var sectionPicture =`<section class="banner-area banner-area2 menu-bg text-center">`
        var banner = `<h1><i>Menu</i></h1><p class="pt-2"><i>전부 다 맛있어 보이잖아!</i></p>`
        db.query('select * from menu', function(error, menus){
          var list = template.list(menus);
          var page = `
          <section class="food-area section-padding">
            <div class="container">
              <div class="row">
                  ${list}
              <div class="col-md-4 col-sm-6">
                <br><br><br>
                  <div class="single-food mt-5">
                    <a href="/diary" class="template-btn mt-3 mm">다이어리 쓰기 !</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          `;
          var html = template.HTML(title, sectionPicture, banner, page);
          response.writeHead(200);
          response.end(html);
        });
    } else if(pathname === '/diary'){     // 다이어리 목록에 대한 화면 가져오기(쓰기, 수정, 삭제 버튼 지원)
      var title = '우승민의 다이어리';
      var sectionPicture =`<section class="banner-area banner-area2 blog-page text-center">`
      var banner = `<h1><i>Diary</i></h1><p>얼만큼 먹었는지 보고, 기록해요!</a>`
      db.query('select * from diary', function(error, diaries){
        db.query('select sum(oPrice) as sumP from diary', function(error, sum){
        var i = 0;
        var menuL = [];
        while(i < diaries.length){
          template.menuHTML(diaries[i].dId).then(function(result){
            menuL.push(result);
          });
          i++;
        }
        setTimeout(function(){
          var list = template.diaryList(diaries, menuL);
          var page = `
          <section class="blog_area section-padding">
            <div class="container">
              <div class="row">
                <div class="progress-table-wrap">
                  <div class="progress-table">
                    <div class="table-head">
                      <div class="serial">번호</div>
                      <div class="visit">제목</div>
                      <div class="visit">설명</div>
                      <div class="country" style="width:430px;">먹은 메뉴</div>
                      <div class="visit">먹은 수량</div>
                      <div class="visit">먹은 금액</div>
                      <div class="country">먹은 날짜</div>
                    </div>
                    ${list}
                  </div>
                </div>
              <div class="row">
                <div class="col-lg-12">
                  <div class="section-top2 text-center">
                    <p>그동안 먹은 총 금액은 ${(sum[0].sumP)} 원!</p>
                    <form method="post" name="form">
                      <input type="submit" class="genric-btn primary circle" value="다이어리 쓰기" onclick="javascript: form.action='/create_diary';"/>
                      ${template.diarySelect(diaries)}
                      <input type="submit" class="genric-btn primary circle" value="다이어리 수정" onclick="javascript: form.action='/update_diary';"/>
                      <input type="submit" class="genric-btn primary circle" value="다이어리 삭제" onclick="javascript: form.action='/delete_diary';"/>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
        `;
        var html = template.HTML(title, sectionPicture, banner, page);
        response.writeHead(200);
        response.end(html);
      },500);
    });
  });
  } else if(pathname === '/create_diary'){    // 다이어리 생성에 대한 화면 만들어주기
    db.query('select * from menu', function(error, menus){
      var title = '우승민의 다이어리';
        var sectionPicture =`<section class="banner-area banner-area2 blog-page text-center">`
        var banner = `<h1><i>Diary</i></h1><p>얼만큼 먹었는지 보고, 기록해요!</a>`
        var page = `
        <section class="blog_area section-padding">
          <div class="container">
            <div class="row">
              <div class="comment-form">
                <form action="/create_process" method="post">
                  <div class="form-group form-inline">
                    <div class="form-group col-lg-6 col-md-6 menu">
                      <p>먹은 메뉴를 선택하세요${template.menuSelect(menus)}</p>
                    </div>
                    <div class="form-group col-lg-6 col-md-6 many">
                      <p>먹은 수량을 선택하세요${template.manySelect(0)}</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <p><input type="text" class="form-control" id="title" name="title" placeholder="제목" onfocus="this.placeholder = ''" onblur="this.placeholder = '제목'"  required=""></p>
                  </div>
                  <div class="form-group">
                    <p><textarea class="form-control mb-10" rows="3" id="description" name="description" placeholder="설명" onfocus="this.placeholder = ''" onblur="this.placeholder = '설명'"></textarea></<p>
                  </div>
                    <input type=submit class="but" value="다이어리 쓰기">
                </form>
              </div>
            </div>
          </div>
        </section>
        `;
        var html = template.HTML(title, sectionPicture, banner, page);
        response.writeHead(200);
        response.end(html);
    });
  } else if(pathname === '/create_process'){    // 다이어리 생성에 대한 post방식 form 처리
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query('select mPrice from menu where mId=?',[post.menuSelect], function(error, menu){
          var price = parseInt(menu[0].mPrice * post.manySelect);
          db.query(`insert into diary (dTime, dTitle, dDesc, mId, mMany, oPrice) values(now(), ?, ?, ?, ?, ?)`,
          [post.title, post.description, post.menuSelect, post.manySelect, price]), function(error, result){
            if(error){
              throw error;
            }
          }
          response.writeHead(302, {Location: `/diary`});
          response.end();
        });
      });
    } else if(pathname === '/update_diary'){    // 다이어리 업데이트에 대한 화면 만들어주기(선택한 다이어리의 기존값 가져옴)
      db.query('select * from menu', function(error, menus){
        var title = '우승민의 다이어리';
        var sectionPicture =`<section class="banner-area banner-area2 blog-page text-center">`
          var banner = `<h1><i>Diary</i></h1><p>얼만큼 먹었는지 보고, 기록해요!</a>`
          var body = '';
          request.on('data', function(data){
              body = body + data;
          });
          request.on('end', function(){
            var post = qs.parse(body);
            db.query(`select menu.mId, diary.mMany, diary.dTitle, diary.dDesc
             from menu join diary on menu.mId = diary.mId where diary.dId=?`,
            [post.diarySelect], function(error, result){
            var page = `
            <section class="blog_area section-padding">
              <div class="container">
                <div class="row">
                  <div class="comment-form">
                    <form action="/update_process" method="post">
                      <input type="hidden" name="id" value="${post.diarySelect}">
                        <div class="form-group form-inline">
                          <div class="form-group col-lg-6 col-md-6 menu">
                            <p>먹은 메뉴를 선택하세요${template.menuSelect(menus, result[0].mId)}</p>
                          </div>
                          <div class="form-group col-lg-6 col-md-6 many">
                            <p>먹은 수량을 선택하세요${template.manySelect(result[0].mMany)}</p>
                          </div>
                        </div>
                        <div class="form-group">
                          <p><input type="text" value="${result[0].dTitle}" class="form-control" id="title" name="title" placeholder="제목" onfocus="this.placeholder = ''" onblur="this.placeholder = '제목'"  required=""></p>
                        </div>
                        <div class="form-group">
                          <p><textarea class="form-control mb-10" rows="3" id="description" name="description" placeholder="설명" onfocus="this.placeholder = ''" onblur="this.placeholder = '설명'">${result[0].dDesc}</textarea></<p>
                        </div>
                          <input type=submit class="but" value="다이어리 수정">
                    </form>
                  </div>
                </div>
              </div>
            </section>
            `;
            var html = template.HTML(title, sectionPicture, banner, page);
            response.writeHead(200);
            response.end(html);
          });
        });
      });
    } else if(pathname === '/update_process'){    // 다이어리 업데이트에 대한 post방식 form 처리
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query('select mPrice from menu where mId=?',[post.menuSelect], function(error, menu){
        var price = parseInt(menu[0].mPrice * post.manySelect);
        db.query('update diary set dId=?, dTime=now(), dTitle=?, dDesc=?, mId=?, mMany=?, oPrice=? where dId=?',
          [post.id, post.title, post.description, post.menuSelect, post.manySelect, price, post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/diary`});
            response.end();
          });
        });
      });
    } else if(pathname === '/delete_diary'){    // 선택한 다이어리에 대한 삭제 기능
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('delete from diary where dId=?', [post.diarySelect], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location:'/diary'});
            response.end();
          });
        });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);

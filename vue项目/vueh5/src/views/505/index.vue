<template>
  <div class="err">
   
<body>
        <nav class="shelf">
            <a class="book home-page" href="http://www.jsdaima.com/" target="_blank">
                代码出错了
            </a>
            <a class="book about-us" href="http://www.jsdaima.com/webpage/" target="_blank">
                出错了
            </a>
            <a class="book contact" style="padding:12px 20px"  href="http://www.jsdaima.com/yuanma/" target="_blank">
                大兄嘚
            </a>
            <a class="book faq" style="padding:12px 20px" href="http://www.jsdaima.com/video/" target="_blank">
                快点改
            </a>
            <span class="book not-found">
            菜鸡菜鸡
            </span>
            <span class="door left">
                喜提BUG
            </span>
            <span class="door right">
              恭喜兄嘚
            </span>
        </nav>
        <h1 class="mt-16">
            Error 505
        </h1>
        <p class="mt-16">
            兄嘚,你的代码出错了奥，请尽快修改。。。
        </p>
    

</body>


  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.err {
 //background: url("../../assets/images/404/404.jpg") no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100vw;
}
*{margin:0px;padding:0px; font-family: "微软雅黑";}
html,iframe,body{height:100%}
.none{display:none !important}
@media screen and (max-width: 640px){#mobileFrame{display:none !important;}}
#hidemobile{font-size: 14px;font-weight: bold;border: 1px solid silver;position: absolute;right: 20px;top: 8px;width: 15px;height: 15px;text-align: center;padding: 0;line-height: 15px;border-radius: 15px;cursor:pointer;}

* {
  padding: 0;
  margin: 0;
}
body, html {
  height: 100%;
}

body {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  padding: 0;
  background-color: #446072;
  font-family: "Microsoft YaHei",sans-serif;
  color: white;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
      -ms-flex-direction: column;
          flex-direction: column;
  overflow: hidden;
}
h1 {
  margin-top: 2rem;
}
p{
  font-family: "Microsoft YaHei","Segoe UI", "Lucida Grande", Helvetica, Arial,sans-serif;
}
.shelf {
  position: relative;
  width: 100%;
  height: 14rem;
  border: 0.5rem solid #374d5b;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  -webkit-perspective: 130rem;
          perspective: 130rem;
  box-shadow: inset 0 0 2rem rgba(0, 0, 0, 0.2);
}
.shelf a {
  text-decoration: none;
}
.door {
  position: absolute;
  width: 50%;
  height: 14rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;
  padding: 1rem;
  background-color: #374d5b;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}
.door::before {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  content: "";
}
.door.left {
  border-radius: 0 0.75rem 0.75rem 0;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
      -ms-flex-pack: end;
          justify-content: flex-end;
  -webkit-animation: 
      leftDoorOpen 3.5s ease-out forwards 1s,
      leftDoorFlap 15s linear infinite forwards 9s;
          animation: 
      leftDoorOpen 3.5s ease-out forwards 1s,
      leftDoorFlap 15s linear infinite forwards 9s;
  -webkit-transform-origin: 0 0 0;
          transform-origin: 0 0 0;
}
.door.right {
  right: 0;
  border-radius: 0.75rem 0 0 0.75rem;
  -webkit-animation: 
      rightDoorOpen 3s ease-out forwards 1.5s,
      rightDoorFlap 10s linear infinite forwards 8s;
          animation: 
      rightDoorOpen 3s ease-out forwards 1.5s,
      rightDoorFlap 10s linear infinite forwards 8s;
  -webkit-transform-origin: 100% 0 0;
          transform-origin: 100% 0 0;
}
.book {
  position: absolute;
  box-sizing: border-box;
  padding: 0.8rem 4rem 0.8rem 2rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  cursor: pointer;
  box-shadow: inset 0 0 0.75rem rgba(255, 255, 255, 0.1);
}
.book.home-page {
  -webkit-transform: rotate(-90deg) translate(-12.4rem, 3rem);
          transform: rotate(-90deg) translate(-12.4rem, 3rem);
  -webkit-transform-origin: 0;
          transform-origin: 0;
}
.book.about-us {
  -webkit-transform: rotate(-100deg) translate(-13.4rem, 6.1rem);
          transform: rotate(-100deg) translate(-13.4rem, 6.1rem);
  -webkit-transform-origin: 0;
          transform-origin: 0;
}
.book.contact {
  right: 2rem;
  bottom: 0.2rem;
  border-radius: 0.3rem 0 0 0.3rem;
}
.book.faq {
  right: 0.8rem;
  bottom: 3.3rem;
  border-radius: 0.3rem 0 0 0.3rem;
}
.book.not-found {
  width: 12rem;
  height: 3.5rem;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background-color: transparent;
  -webkit-transform: rotate(-90deg) translate(-12rem, 13rem) scale(1);
          transform: rotate(-90deg) translate(-12rem, 13rem) scale(1);
  -webkit-transform-origin: 0;
          transform-origin: 0;
  cursor: default;
  -webkit-animation: bookFadeOut 1s 3s infinite forwards;
          animation: bookFadeOut 1s 3s infinite forwards;
}
.book.not-found::after {
  display: block;
  width: 10rem;
  padding-left: 5rem;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='30'><path fill='rgb(255, 255, 255)' d='M7.688,3.737C6.1,10.409,4.624,16.982,2.475,23.517c-0.424,1.29,0.724,2.338,1.957,1.916 c5.879-2.021,11.743-4.107,17.409-6.696c1.246-0.572,0.443-2.366-0.815-1.932c-3.856,1.333-7.695,2.69-11.565,3.959 c2.879-2.526,5.485-5.215,9.013-7.17c4.441-2.459,9.299-4.109,14.281-4.915c10.903-1.772,22.052,0.562,31.979,5.04 c9.241,4.162,12.895,8.725,13.164,4.942c0.121-1.69-5.57-4.953-14.125-8.714C53.19,5.292,41.094,3.539,29.636,6.058 c-7.122,1.567-16.708,5.374-22.064,11.544c1.359-4.455,2.461-9.028,3.032-13.563C10.852,2.091,8.12,1.927,7.688,3.737z'/></svg>");
  background-repeat: no-repeat;
  background-size: 4rem;
  background-position: left center;
  font-family: "Dancing Script";
  text-transform: lowercase;
  font-size: 25px;
  content: "this page can't be found";
  -webkit-transform: rotate(90deg) translate(6rem, -1rem);
          transform: rotate(90deg) translate(6rem, -1rem);
  opacity: 0.3;
}
.book:hover:not(.not-found) {
  background-color: rgba(255, 255, 255, 0.2);
}
@-webkit-keyframes leftDoorOpen {
  60% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@keyframes leftDoorOpen {
  60% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@-webkit-keyframes rightDoorOpen {
  60% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@keyframes rightDoorOpen {
  60% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@-webkit-keyframes rightDoorFlap {
  0% { -webkit-transform: rotateY(120deg); transform: rotateY(120deg)}
  5% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  15% {-webkit-transform: rotateY(117deg);transform: rotateY(117deg)}
  25% {-webkit-transform: rotateY(123deg);transform: rotateY(123deg)}
  30% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@keyframes rightDoorFlap {
  0% { -webkit-transform: rotateY(120deg); transform: rotateY(120deg)}
  5% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  15% {-webkit-transform: rotateY(117deg);transform: rotateY(117deg)}
  25% {-webkit-transform: rotateY(123deg);transform: rotateY(123deg)}
  30% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@-webkit-keyframes leftDoorFlap {
  0% { -webkit-transform: rotateY(-110deg); transform: rotateY(-110deg)}
  5% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  15% {-webkit-transform: rotateY(-107deg);transform: rotateY(-107deg)}
  25% {-webkit-transform: rotateY(-113deg);transform: rotateY(-113deg)}
  30% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@keyframes leftDoorFlap {
  0% { -webkit-transform: rotateY(-110deg); transform: rotateY(-110deg)}
  5% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  15% {-webkit-transform: rotateY(-107deg);transform: rotateY(-107deg)}
  25% {-webkit-transform: rotateY(-113deg);transform: rotateY(-113deg)}
  30% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@-webkit-keyframes bookFadeOut {
  50% {border: 1px dashed rgba(255, 255, 255, 0.1);}
}
@keyframes bookFadeOut {
  50% {border: 1px dashed rgba(255, 255, 255, 0.1);}
}
</style>
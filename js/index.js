function fnLoad(){
	var oWelcome = document.querySelector('#welcome');
	var oMain = document.querySelector('#main');
	var bTime = false;
	var bImg = false;
	var iNum = 0;
	var iTime = new Date().getTime();
	
	for(var i=0; i<5; i++){
		var oImg = new Image();
		oImg.src = 'img/'+ (i+1) +'.jpg';
		oImg.onload = function(){
			iNum++;
			if(iNum == 5){
				bImg = true;
			}
		};
	}
	
	function fnEnd(){
		oWelcome.classList.remove('show_page');
		fnTab();
	}
	
	var timer = setInterval(function(){
		if((new Date().getTime() - iTime) >= 5000){
			bTime = true;
		}
		if( bTime == true && bImg == true){
			clearInterval(timer);
			oWelcome.style.opacity = 0;
			addEvent(oWelcome,'webkitTransitionEnd',fnEnd);
			addEvent(oWelcome,'transitionend',fnEnd);
		}
	},500);
}
//首页轮播图
var locationList = ['那拉提景区','阳泉评梅景区','青天河景区','桂林七星景区','南京明孝陵景区'];
function fnTab(){
	var oWrap = document.querySelector('#tab_pic');
	var oUl = document.querySelector('#tab_list');
	var aLi = oUl.children;
	var aNav = oWrap.querySelector('nav').children;
	var oP = document.querySelector('#tab_mask').querySelector('p');
	var iNow = 0;
	var iX = 0;
	
	var w = document.documentElement.clientWidth;
	var iStartX = 0; //记录手指按下时候的x值
	var iCurrentX = 0; //记录手指移动时的x值
	var DisX = 0;
	var timer = null;
	
	function moveToPosition(){ //封装函数让oUl运动到指定位置
		iX = - iNow * w;
		oUl.style.WebkitTransition = '0.5s all ease';
		oUl.style.transition = '0.5s all ease';
		oUl.style.WebkitTransform = 'translate3d('+ iX +'px,0,0)';
		oUl.style.transform = 'translateX('+ iX +'px,0,0)';
		for (var i=0; i<aNav.length; i++) {
			aNav[i].classList.remove('active');
		}
		aNav[iNow].classList.add('active');		
		oP.innerHTML = locationList[iNow];
	}
	
	function autoMove(){ //封装函数让oUl自动滚动
		timer = setInterval(function(){
			iNow++;
			iNow %= (aLi.length);
			moveToPosition();
		},2500);
	}
	
	autoMove();
	
	addEvent(oUl,'touchstart',fnStart);
	addEvent(oUl,'touchmove',fnMove);
	addEvent(oUl,'touchend',fnUp);
	addEvent(document,'touchmove',function(ev){
		ev.preventDefault();
	});
	
	function fnStart(ev){
		clearInterval(timer); //点下时就清空定时器
		oUl.style.transition = 'none'; //点下时还要清空transition避免拖动的时候也有过渡效果
		oUl.style.WebkitTransition = 'none';
		ev.preventDefault();
		ev = ev.changedTouches[0];
		iStartX = ev.pageX; //记录手指按下时候的x值
		iCurrentX = iX;
	}
	
	function fnMove(ev){
		ev = ev.changedTouches[0];
		DisX = ev.pageX - iStartX;
		iX = iCurrentX + DisX;
		if(iX >= 100){ //这里给iX做个限定，左右都不要让留白超过100px
			iX = 100;
		}
		if(iX <= -(aLi.length-1) * w - 100){
			iX = -(aLi.length-1) * w - 100;
		}
		oUl.style.WebkitTransform = 'translate3d('+ iX +'px,0,0)';
		oUl.style.transform = 'translateX('+ iX +'px,0,0)';
	}
	
	function fnUp(ev){
		ev = ev.changedTouches[0]; 
		if(DisX < -200){ //抬起手指时看看DisX的值，如果绝对值没有超过200，就认为并没有想移动图片，抬起后恢复到原来位置，一旦超过200，再看看DisX正负值。当然也要给iNow做个左右最大值和最小值限制
			iNow++;
			if(iNow == aLi.length){
				iNow = aLi.length -1;
			}
		}else if(DisX > 200){
			iNow--;
			if(iNow == -1){
				iNow = 0;
			}			
		}
		
		moveToPosition(); //再根据iNow重新计算iX，并让oUl运动到那里
		autoMove(); //抬起鼠标重新让oUl自动运动起来
		
		oUl.removeEventListener('fnMove',false);
		oUl.removeEventListener('fnEnd',false);
	}
}

//单独封装一个提示框的函数，传入要出现的提示框对象和要提示的内容
function tipAlert(obj,comment){
	function noScore(){
		setTimeout(function(){
			obj.style.opacity = '0';
			obj.classList.remove('warning');
		},800);				
	}
	obj.style.opacity = '1';
	obj.classList.add('warning');
	obj.innerHTML = comment;
	addEvent(obj,'animationend',noScore);			
	addEvent(obj,'webkitAnimationEnd',noScore);
}

//评分系统和标签
var scoreData = {"score_1":0,"score_2":0,"score_3":0,"tag":""};
var tagData = ['服务好','景色赞','素质普遍有所提高','千篇一律','看人海','挤爆了','不太好','再也不来了','和想象中的不一样'];
function scoreArea(){
	var oMask = document.querySelector('#mask');
	var oMain = document.querySelector('#main');
	var oNews = document.querySelector('#news');
	var oScore = document.querySelector('#score_list');
	var aScore = oScore.querySelectorAll('dd');
	var oTag = document.querySelector('#score_tag .tag_area');
	
	var aList = oScore.querySelectorAll('li'); //获取每个li列表
	for(var i=0; i<aList.length; i++){
		aList[i].dataset.index = i;	//给每个li添加index为了记录每一项用户打的分数
	}
	
	for (var i=0; i<aScore.length; i++) {
		addEvent(aScore[i],'touchstart',score);
	}
	function score(){
		var oList = this.parentNode;
		var scoreItem = oList.parentNode.dataset.index; //这个是被点击的star所在的li的index
		var aStar = oList.querySelectorAll('dd');
		for(var i=0; i<aStar.length; i++){
			aStar[i].dataset.index = i;
			aStar[i].style.backgroundPosition = '-38px 0';
		}
		this.style.backgroundPosition = '0 0';
		for(var i=0; i<(this.dataset.index); i++){
			aStar[i].style.backgroundPosition = '0 0';
		}
		scoreData["score_"+ (Number(scoreItem) + 1)] = Number(this.dataset.index) + 1;	//将每项评分记录到json中
	}
	
	//添加标签
	function scoreTag(){
		for(var i=0; i<tagData.length; i++){
			var oSpan = document.createElement('span');
			oSpan.innerHTML = tagData[i];
			oTag.appendChild(oSpan);
		}
	}
	scoreTag();
	
	var aTag = oTag.querySelectorAll('span');
	function tagSelect(){
		for (var i=0; i<aTag.length; i++) {
			aTag[i].classList.remove('active');
		}
		this.classList.add('active');
		scoreData.tag = this.innerHTML;
	}
	for (var i=0; i<aTag.length; i++) {
		addEvent(aTag[i],'touchstart',tagSelect);
	}
	
	//给提交按钮添加点击事件
	var oBtn = oMain.querySelector('.submit_score');
	var oTip_main = oMain.querySelector('.tip_alert');
	
	function btnSubmit(ev){
		var bScore = true;
		var bTag = true;
		ev.preventDefault();
		for(var key in scoreData){ //检查是否三项都评分了
			if(scoreData[key] === 0){ //这里一定要用全等，用双等会判断失误,因为有可能最后一项tag那时是空string，用双等0其实也为true
				bScore = false;
			}
		}
		
		if(scoreData.tag == ''){ //判断标签是否有选中
			bTag = false;
		}
		
		if(!bScore){
			tipAlert(oTip_main,'请给景区打分!');
			return
		}else if(!bTag){
			tipAlert(oTip_main,'给景区添加标签!');
			return
		}
		
		if(bScore === true && bTag === true){
			oMask.classList.add('show_page');
			setTimeout(function(){
				oMask.style.opacity = '1';
				oMain.style.filter = oMain.style.webkitFilter = 'blur(5px)';
			},20);
			
			setTimeout(function(){
				oMask.style.opacity = '0';
				oMain.classList.remove('show_page');
				oNews.classList.add('show_page');
				setTimeout(function(){
					oMask.classList.remove('show_page');
					oNews.style.opacity = '1';
				},20);
			},2500); //过2.5秒之后让mask和main都消失，过渡到新闻页
		}
	}
	addEvent(oBtn,'touchstart',btnSubmit);
}

//新闻页上传视频和照片
function upload_news(){
	var oNews = document.querySelector('#news');
	var oForm = document.querySelector('#form');
	var oTag = oForm.querySelector('.tags');
	var oUploadVideo = document.querySelector('#upload_video');
	var oUploadPhoto = document.querySelector('#upload_photo');
	var oTip_news = oNews.querySelector('.tip_alert')
	var oH3html = '';
	
	function switchPage(){
		oNews.classList.remove('show_page');
		oForm.classList.add('show_page');
		formPage(oH3html);
	}
	
	oUploadVideo.onchange = function(){
		if(this.files[0].type.split('/')[0] !== 'video'){
			tipAlert(oTip_news,'请上传视频文件');
		}
		switchPage();
		oH3html = '给视频添加标签';
	};
	
	oUploadPhoto.onchange = function(){
		if(this.files[0].type.split('/')[0] !== 'image'){
			tipAlert(oTip_news,'请上传图片文件');
			return;
		}
		switchPage();
		oH3html = '给图片添加标签';
	};
}

//表单页
function formPage(title){
	var oForm = document.querySelector('#form');
	var oTag = oForm.querySelector('.tags');
	var oBtn = oForm.querySelector('button');
	var oOver = document.querySelector('#over');
	
	function scoreTag(){
		for(var i=0; i<tagData.length; i++){
			var oSpan = document.createElement('span');
			oSpan.innerHTML = tagData[i];
			oTag.appendChild(oSpan);
		}
	}
	scoreTag();	
	
	var aTags = oTag.querySelectorAll('span');
	
	function addTag(){
		for (var i=0; i<aTags.length; i++) {
			aTags[i].classList.remove('active');
		}
		this.classList.add('active');
		oBtn.removeAttribute('disabled');
		oBtn.classList.add('active');
	}
	
	for (var i=0; i<aTags.length; i++) {
		addEvent(aTags[i],'touchstart',addTag);
	}
	
	//按上传按钮跳转到最后一页
	function switchOver(ev){
		oForm.style.opacity = '0';
		oForm.classList.remove('show_page');
		oOver.style.opacity = '1';
		oOver.classList.add('show_page');
		ev.preventDefault();
	}
	addEvent(oBtn,'touchstart',switchOver);
}

//结束页
function lastPage(){
	var oMain = document.querySelector('#main');
	var oOver = document.querySelector('#over');
	var oBtn = oOver.querySelector('button');
	var aScore = oMain.querySelectorAll('dd');	
	var oTag = document.querySelector('#score_tag .tag_area');
	var aTags = oTag.querySelectorAll('span');
	
	function switchMain(ev){
		oOver.classList.remove('show_page');
		oMain.classList.add('show_page');		
		setTimeout(function(){
			oOver.style.opacity = '0';
			oMain.style.opacity = '1';
			oMain.style.filter = oMain.style.webkitFilter = 'blur(0px)';
		},20);	
		
		for (var i=0; i<aTags.length; i++) {
			aTags[i].classList.remove('active');
		}
		for (var i=0; i<aScore.length; i++) {
			aScore[i].style.backgroundPosition = '-38px 0';
		}
		
		ev.preventDefault();		
	}
	
	addEvent(oBtn,'touchstart',switchMain);
}








































/*
* @Author: pisco
* @Date:   2018-07-15 22:04:20
* @Last Modified by:   pisco
* @Last Modified time: 2018-07-16 12:42:27
*/
 var me = true;//默认黑子
 var chessBoard = [];//创建数组存储网格点是否已经有棋子的情况
 var over = false;//表示棋有没有结束 
 var wins = [];//赢法数组
//赢法的统计数组
 var myWin = [];
 var computerWin = [];
for(var i=0; i<15; i++){
 	chessBoard[i]=[];
 	for(var j=0; j<15; j++){
 		chessBoard[i] [j] = 0;//0代表无子
 	}
 }
 //赢法数组
for(var i=0; i<15; i++) {
	wins[i] = [];
	for(var j=0; j<15; j++) {
		wins [i] [j] = [];
	}
}
var count = 0;
//统计所有横线的赢法
for(var i=0; i<15; i++) {
	for(var j=0; j<11; j++) {
		 //wins[0][0][0] = true
		 //wins[0][1][0] = true
		 //wins[0][2][0] = true
		 //wins[0][3][0] = true
		 //wins[0][4][0] = true
		 
		 //wins[0][1][1] = true
		 //wins[0][2][1] = true
		 //wins[0][3][1] = true
		 //wins[0][4][1] = true
		 //wins[0][5][1] = true
		for(var k=0; k<5; k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//统计所有竖线的赢法
for(var i=0; i<15; i++) {
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
//统计所有斜线的赢法
for(var i=0; i<11; i++) {
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
//统计所有反斜线的赢法
for(var i=0; i<11; i++) {
	for(var j=14; j>3; j--) {
		for(var k=0; k<5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}
console.log(count);//查看总共有多少种赢法
for(var i=0; i<count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

 var chess = document.getElementById('chess');
 var context = chess.getContext('2d');
 context.strokeStyle = "#00FF00";//设置画笔颜色
var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);//加载底部图片
	drawChessBoard();
	//oneStep(0, 0, true);
	//oneStep(1, 1, false);
}
//画棋盘
var drawChessBoard = function(){
	for(var i = 0; i<15;i++){
		//画横线
		context.moveTo(15 + i*30,15);
		context.lineTo(15 + i*30,435);
		context.stroke();//stroke用来描边
		//画竖线
		context.moveTo(15,15 + i*30);
		context.lineTo(435,15 + i*30);
		context.stroke();
	}
}
var oneStep = function(i, j, me){
	//画棋子
	context.beginPath();
	//arc可用来画扇形，三个参数：圆心坐标：200，200，半径，扇形启示弧度和终点弧度
	context.arc(15 + i*30, 15 + j*30, 13,0, 2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 -2, 13,15 + i*30 + 2, 15 + j*30 -2, 0);//设置棋子渐变颜色
	if(me){
		gradient.addColorStop(0, "#0A0A0A");//黑子
        gradient.addColorStop(1, "#636766");
	
	}else{
		gradient.addColorStop(0, "#D1D1D1");//白子
	    gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();//fill用来填充
}
//鼠标点击落子实现
chess.onclick = function(e){
	if(over) {
		return;
	}
	if(!me) {
		return;
	}
	var x = e.offsetX;//横坐标
	var y = e.offsetY;//纵坐标
	var i = Math.floor(x / 30);//计算落点索引位置，Math.floor:向下取整
	var j = Math.floor(y / 30);
	//没有棋子的情况才能落子
	if(chessBoard[i][j] == 0){
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		for(var k=0; k<count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
                computerWin[k] = 6;//表示不能再赢了
                if(myWin[k] == 5) {
                	window.alert("你赢了");
                	over = true;
                }
			}
		}
		if(!over) {
			me = !me;//默认黑子，落子后取反，实现黑白子交替出现
			computerAI();
		}
	}
}

var computerAI = function() {
	var myScore = [];//玩家得分
	var computerScore = [];//计算机得分
	var max = 0;//保存最高分数
	var u = 0;//（u,v）最高分数点坐标
	var v = 0;
	for(var i=0; i<15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0; j<15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0; i<15; i++) {
		for(var j=0; j<15; j++) {
			if(chessBoard[i][j] == 0) {
				for(var k=0; k<count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] +=200;
						}else if(myWin[k] == 2) {
							myScore[i][j] +=400;
						}else if(myWin[k] == 3) {
							myScore[i][j] +=2000;
						}else if(myWin[k] == 4) {
							myScore[i][j] +=10000;
						}
						if(computerWin[k] == 1) {
							computerScore[i][j] +=220;
						}else if(computerWin[k] == 2) {
							computerScore[i][j] +=420;
						}else if(computerWin[k] == 3) {
							computerScore[i][j] +=2200;
						}else if(computerWin[k] == 4) {
							computerScore[i][j] +=20000;
						}
					}
				}
				if(myScore[i][j] > max) {
				   max = myScore[i][j];
				   u = i;
				   v = j;	
				}else if(myScore[i][j] == max) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max) {
				   max = computerScore[i][j];
				   u = i;
				   v = j;	
				}else if(computerScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k=0; k<count; k++) {
			if(wins[u][v][k]) {
				computerWin[k]++;
                myWin[k] = 6;//表示不能再赢了
                if(computerWin[k] == 5) {
                	window.alert("计算机赢了");
                	over = true;
                }
			}
		}
		if(!over) {
			me = !me;//默认黑子，落子后取反，实现黑白子交替出现
		}
}

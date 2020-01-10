const Items=[
  {
    title: "准备开始",
    description: "2019-2020 年会",
    Player: "自定义",
    defTime:" - 15:00",
    duration:"30",
    rule:"自定义",
  },
  {
    title: "开场",
    description: "开场视频、2019 年度工作总结，2020 未来展望",
    Player: "李玥",
    defTime:"15:00 - 15:30",
    duration:"30",
    rule:"开场视频|连线贵阳|2019 年度工作总结|2020 未来展望",
  },
  {
    title: "个人总结",
    description: "2019 个人总结、2020 个人目标/希望",
    Player: "8 人轮流发言",
    defTime:"15:30 – 15:45",
    duration:"15",
    rule:"陈述人一句话说出个人 2019 最大的收获、以及 2020 最大的期望或者目标。所有人陈述完成后，\n" +
      "由大家投票选出说的最好的一个人。|奖惩措施： 活动奖",
  },
  {
    title: "猜真话假",
    description: "真话假话猜猜猜",
    Player: "9 人",
    defTime:"15:50 - 16:20",
    duration:"30",
    rule:"每个人选择提前选择 3 个喜好写在纸条上， 里面 2 个是真实的，1 个是虚假，不允许其它人看，折好放在桌上.陈述人阐述话题 30s - 60s。阐述完成后由小组投票判断，哪个是谎言。如超过半数人猜对，则陈述人受到惩罚，否则陈述人过关。" +
      "|奖惩措施 ：旋转惩罚转盘，接受惩罚",
  },
  {
    title: "有没有",
    description: "你有我没有",
    Player: "8 人",
    defTime:"16:20 – 16:50",
    duration:"30",
    rule:"每个人伸出五根手指 然后参与游戏的人轮流说一个自己没有的 （比如：我不是黑头发；我不是男生；我不会弹吉他，我没喝过酒等），其他人如果有过（和说的人相反），就弯一个手指， 谁先第一个握" +
      "拳谁就输了。每个人说的条件或者判断自己是否符合条件，要求都必须是真实的，靠诚信自觉啦。|奖惩措施： 活动奖，淘汰者旋转惩罚转盘。",
  },
  {
    title: "贪不贪",
    description: "贪不贪",
    Player: "8 人",
    defTime:"17:00 – 17:30",
    duration:"30",
    rule:"1）两人一组，随机抽签组队，共 4 个队。|2）主持人提问，每队抢答，需要举手喊出“抢答”才算数。抢答成功需要在 5 秒内说出答案。|3）答错或 5 秒内未能说出正确答案，要受到惩罚，其他队可以继续抢答直到该题答对；" +
      "|4）答对，可以选择一个号牌，揭开该号牌对应纸杯中最上面的一个纸杯：=>如果显示的是 ”空“，则该队这一轮所有累计得分全部清零（只清空本轮的分数）；=>如果显示是 ”分值“，则该队可获得相应的分数，抽到分值可以选择继续或者停止：" +
      "止”，则本轮结束，主持人记录这一局该队的累计分值；续”，则继续选择一个号牌。|5）所有题目答完后分数最多的一组获胜。|6）如果出现最后分数一样的情况，可进行“福不福”游戏决定胜负。“福不福”规则：准备两个纸条，一个写“空”，" +
      "一个写“福”，抽到“福”的队获胜。|奖惩措施： 活动奖",
  },
  {
    title: "你画我猜",
    description: "你画我猜",
    Player: "8 人",
    defTime:"17:30 – 17：50",
    duration:"20",
    rule:"两人一组，抽签决定。一人肢体比划，一人猜。规定时间内猜对最多的组获胜。|奖惩措施： 活动奖",
  },
  {
    title: "三人一脑",
    description: "三人一脑",
    Player: "8 人",
    defTime:"17:50 – 18:00",
    duration:"10",
    rule:"1）8 个人抽签决定顺序，单号为一组，双号为一组|2）第一轮 1,3,5 号先进行游戏，淘汰一人；第二轮 2,4,6 进行，淘汰一人；第三轮单号继续进行游戏，从7 倒序开始，淘汰一人；第四轮双号继续进行游戏，从 8 倒序开始，淘汰一人；" +
      "第五轮剩下的四人按从小到大顺序选出三人开始，最大的一位替补；第六轮由第五轮胜利者和替补进行最终角逐，按从小到大顺序开始。|3）每轮 3 个人，主持人问一个问题，从 1 号开始，按照顺序循环回答（如：1-2-3-1…），每人只能说一个字或者一个词语，" +
      "需要和之前的词有一定的逻辑性，能连成这个问题的回答。|4）每道题循环无上限，超过 3 秒没有接上、或出现逻辑错误、和问题不搭边儿、或不是词语，则该问题败，该人淘汰，按抽签顺序换下一个人，重新开始新的问题。|奖惩措施： 淘汰惩罚|" +
      "举例说明：\n" +
      "主持人提问：周末你一般怎么过？\n" +
      "1 号答：【我】 - 2 号答：【喜欢】 - 3 号答：【和】 - 1 号答：【朋友】 – 2 号答：【一起】 - 3 号答：\n" +
      "【逛街】 – 1 号答：【聊天】 – 2 号答：【好】 -3 号答：【开心】 -1 号答：【的】-2 号答：【什么】\n" +
      "（=>2 号“什么”失败，淘汰，4 号上，134 号开始新的问答）",
  },
  {
    title: "去饭店",
    description: "出发前往饭店",
    Player: "All 人",
    defTime:"18:00 -",
    duration:"30",
    rule:"任意方式",
  },
  {
    title: "连线佛山",
    description: "连线佛山",
    Player: "All 人",
    defTime:"18:30 - 18:45",
    duration:"15",
    rule:"任意方式",
  },
  {
    title: "晚宴",
    description: "晚宴",
    Player: "All 人",
    defTime:"19:00 -",
    duration:"60",
    rule:"自由发挥",
  },
];

angular.module('app', [])

// The example of the full functionality
  .controller('TestController',function ($scope) {
      'use strict';

      $scope.items = Items;
      $scope.i = 0;
      $scope.time = 0;
      $scope.m = 0;
      $scope.s = 0;
      $scope.progress = 0;
      $scope.timer = null;
      $scope.p = false;
      $scope.list = ['Player','defTime','duration','description','rule'];
      $scope.change=function (index) {
        $scope.i=index;
        $scope.reset();
      };
      $scope.start=function(){
        $scope.time = 0;
        $scope.p = true;

        $scope.timer = setInterval(s=>{
          if (!$scope.p) return false;
          if ($scope.time >= $scope.items[$scope.i]['duration']*60) {
            $scope.reset();
          } else {
            $scope.time +=1;
            $scope.progress =($scope.time / 60 / $scope.items[$scope.i]['duration'] * 100).toFixed(0) + '%';
            $scope.m= Math.floor($scope.items[$scope.i]['duration'] - $scope.time / 60);
            const flag= Math.floor(($scope.items[$scope.i]['duration'] * 60 - $scope.time) % 60);
            $scope.s= flag > 9? flag:'0'+flag;
          }

          $scope.$apply();
          console.log($scope.time,$scope.progress);
        }, 1000)
      }
      $scope.pause=function(){
        $scope.p = false;
      }
      $scope.upKey=function(){
        $scope.p?$scope.pause():$scope.start();
      }
      $scope.reset=function(){
        $scope.time = 0;
        clearInterval($scope.timer);
        $scope.timer = null;
        $scope.p = false;
        $scope.progress = 0;
        $scope.m = 0;
        $scope.s = 0;
      }
    }
  )

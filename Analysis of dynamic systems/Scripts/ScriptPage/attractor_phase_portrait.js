let heightContent = document.documentElement.clientHeight;
let heightMenu = $("nav").height();
$(".row").height(heightContent - heightMenu);

app = Vue.createApp({
    data() {
        return {
            canvas: null,
            ctx: null,
            activSystems: null,
            startPoint: {
                x: 0,
                y: 0,
                z: 0,
            },

            isPlay: false,
            params: {},
            maxP: null,
            minP: null,

            colorLine: "#f00",
            colorBackGround: "#000",

            integratioStep: 0.01,
            countPointsNoShow: 10000,
            countPoint: 10000,
            indexPoint: 0,

            sizeX: 400,
            sizeY: 400,

            colorText: "#fff",
            sizeText: 16,
        }
    },
    methods: {
        startPage: function () {
            this.canvas = document.getElementById('windowForVizualization');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.setAttribute("width", $("canvas").width());
            this.canvas.setAttribute("height", $("canvas").height());

            this.activSystems = new DynamicalSystems(
                function (p) {
                    return this.params.sigma * (p.y - p.x);
                },
                function (p) {
                    return p.x * (this.params.r - p.z) - p.y;
                },
                function (p) {
                    return p.x * p.y - this.params.b * p.z;
                });
            this.activSystems.params.sigma = 10;
            this.activSystems.params.r = 28;
            this.activSystems.params.b = 8.0 / 3;
            this.params = this.activSystems.params;

            this.startPoint = new Point(0.2, 0.0, 0.0);
            this.ctx.fillStyle = this.colorLine;
        },
        doStart: function(){
            if(this.maxP == null){
                this.clrscr();
                this.setSize();
            }
            this.isPlay = !this.isPlay;
        },
        savePage: function () {

            var link = document.createElement('a');
            link.download = 'FPA.png';
            link.href = this.canvas.toDataURL()
            link.click();
        },
        doServes: function (){
            let _this = this;
            $.ajax({
                url: "/Calculation/saveFPA",
                type: "POST",
                data: {
                    imgBase64: _this.canvas.toDataURL(),
                },
            success: function (data) {
                alert(data.Name);
            },
            error: function (data) {
                alert("Ошибка");
            }
        });
        },
        setSize: function(){
            var rememberPoint = new Point(this.startPoint.x, this.startPoint.y, this.startPoint.z);
            this.activSystems.CONST_H = 0.05;
            this.maxP = new Point(-10000, -10000, -10000);
            this.minP = new Point(+10000, +10000, +10000);

            let COUNT_SELECT = 100000;

            for(let i = 0; i < COUNT_SELECT; i++){
                
                this.startPoint = this.activSystems.getNextPoint(this.startPoint);

                if(this.startPoint.x < this.minP.x){ this.minP.x = this.startPoint.x; }
                if(this.startPoint.y < this.minP.y){ this.minP.y = this.startPoint.y; }
                if(this.startPoint.z < this.minP.z){ this.minP.z = this.startPoint.z; }

                if(this.startPoint.x > this.maxP.x){ this.maxP.x = this.startPoint.x; }
                if(this.startPoint.y > this.maxP.y){ this.maxP.y = this.startPoint.y; }
                if(this.startPoint.z > this.maxP.z){ this.maxP.z = this.startPoint.z; }
            }
            this.activSystems.CONST_H = this.integratioStep;
            this.startPoint = new Point(0.02, 0.0, 0.0);
        },
        a: function(){
            let r = this.activSystems.getLyapynovExponent();
            alert(r);
        },

        drawNextPoint: function () {
            if(this.isPlay){
                this.startPoint = this.activSystems.getNextPoint(this.startPoint, this.integratioStep);
                let _max = this.maxP,
                    _min = this.minP,
                    sizeX = this.sizeX,
                    sizeY = this.sizeY,
                    widthWindow = this.canvas.width,
                    heightWindow = this.canvas.height,
                    x = (this.startPoint.x - _min.x)/(_max.x - _min.x)*sizeX + (widthWindow - sizeX)/2.0,
                    y = sizeY - (this.startPoint.z - _min.z)/(_max.z - _min.z)*sizeY + (heightWindow - sizeY)/2.0;
                this.indexPoint += 1;

                if(this.indexPoint > this.countPointsNoShow){
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        },
        setParams: function(key){
            this.activSystems.params[key] = event.currentTarget.value;
        },
        setRelationAttraktor: function(){
            this.clrscr();
            this.setSize();
            let _max = this.maxP,
                _min = this.minP,
                sizeX = this.sizeX,
                sizeY = this.sizeY,
                widthWindow = this.canvas.width,
                heightWindow = this.canvas.height;
            for(let i = 0; i < this.countPoint + this.countPointsNoShow; i++){
                this.indexPoint += 1;
                this.startPoint = this.activSystems.getNextPoint(this.startPoint, this.integratioStep);
                let x = (this.startPoint.x - _min.x)/(_max.x - _min.x)*sizeX + (widthWindow - sizeX)/2.0,
                    y = sizeY - (this.startPoint.z - _min.z)/(_max.z - _min.z)*sizeY + (heightWindow - sizeY)/2.0;

                if(this.indexPoint > this.countPointsNoShow){
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
            this.indexPoint = 0;
            this.startPoint = new Point(0.02, 0.0, 0.0);
        },
        clrscr: function(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        setCodeAttractor: function(){
            this.ctx.fillStyle = this.colorText;
            this.ctx.font = "italic " + this.sizeText + "pt Arial";

            let rowPx = 50,
                LEFT_STEP = 20;

            for(let i in this.activSystems.params){
                let textParam = "" + i + ": " + this.activSystems.params[i].toFixed(3);
                this.ctx.fillText(textParam, LEFT_STEP, rowPx);
                rowPx += (Number(this.sizeText) + 8);
            }

            this.ctx.fillStyle = this.colorLine;
        },
    },
    mounted() {
        setInterval(() => {
            this.drawNextPoint();
        });
    },
    watch: {
        colorLine: function (newQuestion, oldQuestion) {
            this.colorLine = newQuestion;
            this.ctx.fillStyle = this.colorLine;
        },
        colorBackGround: function (newQuestion, oldQuestion) {
            this.colorBackGround = newQuestion;
            this.canvas.style.background = newQuestion;
        },
        integratioStep: function (newQuestion, oldQuestion) {
            this.integratioStep = parseFloat(newQuestion);
            this.activSystems.CONST_H = this.integratioStep;
        },
        countPointsNoShow: function (newQuestion, oldQuestion) {
            this.countPointsNoShow = newQuestion;
        },
        countPoint: function (newQuestion, oldQuestion) {
            this.countPoint = newQuestion;
        },
        sizeX: function (newQuestion, oldQuestion) {
            this.sizeX = newQuestion;
        },
        sizeY: function (newQuestion, oldQuestion) {
            this.sizeY = newQuestion;
        },
        colorText: function (newQuestion, oldQuestion) {
            this.colorText = newQuestion;
        },
        sizeText: function (newQuestion, oldQuestion) {
            this.sizeText = newQuestion;
        },
    },
}).mount('#base');
app.startPage();
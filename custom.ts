
/**
* このファイルを使って、独自の関数やブロックを定義してください。
* 詳しくはこちらを参照してください：https://minecraft.makecode.com/blocks/custom
*/
/**
 * maze
 */
//% weight=100 color=#0fbc11 icon=""
namespace maze {
    let genelator: MazeGenerator
    /**
     * TODO: 迷路を生成する
     */
    //% block
    export function GenerateMaze(x: number = 15, y: number = 15): number[][][] {
        // Add code here
        genelator = new MazeGenerator(x,y)
        return genelator.searchData
    }

    /**
     * TODO: 生成した迷路を表示する
     */
    //% block
    export function MazeView(): void{
        if (genelator != null && genelator.searchData != null){
            genelator.MazeView()
        }else{
            player.say("※迷路が生成されていません！")
        }
    }

    /**
    * TODO: 生成した迷路をブロックに変換する
    */
    //% block
    export function MazeToBlocks(baseY: number, upY: number = 3, originX: number = 0, originZ: number = 0):void{
        if (genelator != null && genelator.searchData != null) { 
            genelator.MazeToBlocks(baseY, upY, originX, originZ) 
        } else {
            player.say("※迷路が生成されていません！")
        }
    }

    /**
    * TODO: スタートの座標を取得する
    */
    //% block
    export function StartMazePos(baseY: number):Position{
        return world(genelator.startPosX, baseY,genelator.startPosZ)
    }

    /**
    * TODO: ゴールの座標を取得する
    */
    //% block
    export function GoalMazePos(baseY: number):Position{
        return world(genelator.goalPosX, baseY, genelator.goalPosZ)
    }

    class MazeGenerator {
        static searchData: number[][][]
        private ___searchData_is_set: boolean
        private ___searchData: number[][][]

        public startPosX :number
        public startPosZ :number

        public goalPosX :number
        public goalPosZ :number

        get searchData(): number[][][] {
            return this.___searchData_is_set ? this.___searchData : MazeGenerator.searchData
        }
        set searchData(value: number[][][]) {
            this.___searchData_is_set = true
            this.___searchData = value
        }

        public static __initMazeGenerator() {
            MazeGenerator.searchData = null
        }

        public MazeView() {
            let out: string;
            for (let i = 0; i < this.searchData.length; i++) {
                out = ""
                for (let j = 0; j < this.searchData[i].length; j++) {
                    if (this.searchData[i][j][0] == 1) {
                        out += "■"
                    } else {
                        out += "　"
                    }

                }
                player.say(out)
            }
        }

        public MazeToBlocks(baseY: number, upY: number = 3, originX: number = 0, originZ: number = 0) {
            blocks.fill(AIR, world(originX, baseY, originZ), world(originX + this.searchData.length, baseY + upY, originZ + this.searchData[0].length), FillOperation.Replace)
            for (let i = 0; i < this.searchData.length; i++) {
                for (let j = 0; j < this.searchData[i].length; j++) {
                    if (this.searchData[i][j][0] == 1) {
                        blocks.fill(IRON_BLOCK, world(originX + j, baseY, originZ + i), world(originX + j, baseY + upY, originZ + i), FillOperation.Replace)
                    }

                }
            }
        }

        constructor(x: number, y: number) {
            MazeGenerator.__initMazeGenerator()
            let j: number;
            let i: number;
            let searchMax: number;
            let checkCnt: number;
            let checkDirBuffer: number[];
            let isWall: boolean;
            let isStart :boolean;
            let checkDir: number;
            let isIndexOutRange1: any;
            let isIndexOutRange2: any;
            let isIndexOut: any;
            // マップ情報,探索済みかどうか
            // 情報 0 = 空気 1 = 壁 2 = スタート 3 = ゴール
            // 探索状況 0 = 未探索 1 = 探索済み
            let progressCount = 0
            let searchMapXMax = x - 2
            let searchMapYMax = y - 2
            let rDigX = 0
            let rDigY = 0
            let mapMax = 0
            let isSearch = false
            this.searchData = [[[1, 0]]]
            for (j = 0; j < x - 1; j++) {
                this.searchData[0].push([1, 0])
            }
            // mapMax += 1
            for (i = 1; i < y; i += 1) {
                this.searchData.push([])
                for (j = 0; j < x; j++) {
                    this.searchData[i].push([1, 0])
                }
            }
            mapMax = Math.trunc((x - 2) * (y - 2) * 0.75)
            let checkPos1 = [0, 0]
            let checkPos2 = [0, 0]
            player.say("<<<<------------------------Generate------------------------>>>>")
            //  while ( rDigX % 2 == 0 or rDigY % 2 == 0):
            //      rDigX = randint(1,searchMapXMax)
            //      rDigY = randint(1 ,searchMapYMax)
            rDigX = 1
            rDigY = 1

            isStart = true
            this.startPosX = rDigX
            this.startPosZ = rDigY
            this.searchData[rDigY][rDigX][0] = 0
            this.searchData[rDigY][rDigX][1] = 2
            // メインループ
            while (true) {
                searchMax = 0
                // 探索済みかどうか計測
                // player.say("------------Check Search------------")
                for (i = 1; i < y - 1; i++) {
                    for (j = 1; j < x - 1; j++) {
                        if (this.searchData[i][j][1] == 1) {
                            searchMax += 1
                        }
                    }
                }
                // player.say(">>Search :" + searchMax + " MapMax:" + mapMax)
                // マップの要素すべて探索済みになった場合生成終了
                if (searchMax >= mapMax) {
                    player.say("------------Done!------------")
                    break
                } else if (isSearch) {
                    isSearch = false

                    if(isStart){
                        isStart = false
                        this.searchData[rDigY][rDigX][0] = 3
                        this.goalPosX = rDigX
                        this.goalPosZ = rDigY
                    }

                    rDigX = randint(1, searchMapXMax)
                    rDigY = randint(1, searchMapYMax)
                    // 道かどうか && !(X座標が偶数か && Y座標が偶数か)でない場合もう一度探索
                    while (this.searchData[rDigY][rDigX][0] == 1 || (rDigX % 2 == 0 || rDigY % 2 == 0)) {
                        rDigX = randint(1, searchMapXMax)
                        rDigY = randint(1, searchMapYMax)
                    }
                }

                // player.say(">>Next DigPos : x." + rDigX + " y." + rDigY)
                progressCount += 1
                // player.say(">>Progress : " + progressCount)
                // 上下左右確認し、どの方向が掘れるか調べる(すべての方向掘れない場合確認終了,掘れる場合掘る)
                checkCnt = 0
                checkDirBuffer = [0, 0, 0, 0]
                // 0南 1北 2西 3東
                isWall = false
                // player.say("------------CheckRandomDir------------")
                while (checkCnt < 4) {
                    checkDir = randint(0, 3)
                    while (checkDirBuffer[checkDir] != 0) {
                        checkDir = randint(0, 3)
                    }
                    checkDirBuffer[checkDir] = 1
                    checkCnt += 1
                    // player.say(">>Done RandomDir :" + checkDir)
                    // player.say(">>CheckCnt :" + checkCnt)
                    // player.say(">>CheckDigPos: x." + rDigX + " y." + rDigY)
                    // チェックする配列を方向に合わせて設定
                    if (checkDir == 0) {
                        checkPos1[0] = rDigX
                        checkPos1[1] = rDigY - 1
                        checkPos2[0] = rDigX
                        checkPos2[1] = rDigY - 2
                    } else if (checkDir == 1) {
                        checkPos1[0] = rDigX
                        checkPos1[1] = rDigY + 1
                        checkPos2[0] = rDigX
                        checkPos2[1] = rDigY + 2
                    } else if (checkDir == 2) {
                        checkPos1[0] = rDigX - 1
                        checkPos1[1] = rDigY
                        checkPos2[0] = rDigX - 2
                        checkPos2[1] = rDigY
                    } else if (checkDir == 3) {
                        checkPos1[0] = rDigX + 1
                        checkPos1[1] = rDigY
                        checkPos2[0] = rDigX + 2
                        checkPos2[1] = rDigY
                    }

                    isIndexOutRange1 = 0 < checkPos1[0] && 0 < checkPos1[1] && (checkPos1[0] <= searchMapXMax && checkPos1[1] <= searchMapYMax)
                    isIndexOutRange2 = 0 < checkPos2[0] && 0 < checkPos2[1] && (checkPos2[0] <= searchMapXMax && checkPos2[1] <= searchMapYMax)
                    isIndexOut = isIndexOutRange1 && isIndexOutRange2
                    // player.say(">>isIndexOut :" + isIndexOut)
                    // 掘れるかどうか(壁かどうか && X範囲内か && Y範囲内か)
                    isWall = isIndexOut && (this.searchData[checkPos1[1]][checkPos1[0]][0] == 1 && this.searchData[checkPos2[1]][checkPos2[0]][0] == 1) && this.searchData[checkPos1[1]][checkPos1[0]][1] == 0 && this.searchData[checkPos2[1]][checkPos2[0]][1] == 0
                    // player.say(">>isWall :" + isWall)
                    // チェックした方向を設定する
                    if (isIndexOutRange1) {
                        this.searchData[checkPos1[1]][checkPos1[0]][1] = 1
                    }

                    // player.say(">>Search CheckPos1 : x." + checkPos1[0] + " y." + checkPos1[1])
                    if (isIndexOutRange2) {
                        this.searchData[checkPos2[1]][checkPos2[0]][1] = 1
                    }

                    // player.say(">>Search CheckPos2 : x." + checkPos2[0] + " y." + checkPos2[1])
                    if (isWall) {
                        // 掘ってbreak
                        this.searchData[checkPos1[1]][checkPos1[0]][0] = 0
                        this.searchData[checkPos2[1]][checkPos2[0]][0] = 0
                        // player.say(">>Dig!")
                        break
                    }

                }
                // player.say(">>NextCheck------------------>")
                // 掘れた場合掘った先（道）を起点にする
                if (isWall) {
                    // player.say("------------Keep digging continuously------------")
                    rDigX = checkPos2[0]
                    rDigY = checkPos2[1]
                } else {
                    // ランダムに掘りたいポイントを決める（決めたポイントがすでに）
                    isSearch = true
                }

            }
        }

    }


}

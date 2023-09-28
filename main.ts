let i: number;
let j: number;
let searchMax: number;
let checkCnt: number;
let checkPos1: number[];
let checkPos2: number[];
let checkDirBuffer: number[];
let isWall: boolean;
let checkDir: number;
let rdigX: number;
let out: string;
let mapX = 10
let mapY = 10
// マップ情報,探索済みかどうか
// 情報 0 = 空気 1 = 壁
// 探索状況 0 = 未探索 1 = 探索済み
let searchData = [[[1, 0]]]
let searchMapXMax = mapX - 1
let searchMapYMax = mapY - 1
let mapMax = 0
_py.py_array_pop(searchData[0], 0)
for (i = 0; i < searchMapYMax; i++) {
    searchData.push([])
    for (j = 0; j < mapX; j++) {
        searchData[i].push([0, 0])
        mapMax += 1
    }
}
let isEnd = false
let rDigX = randint(1, searchMapXMax)
let rDigY = randint(1, searchMapYMax)
while (!isEnd) {
    searchMax = 0
    // 探索済みかどうか計測
    for (i = 0; i < searchMapYMax; i++) {
        for (j = 0; j < searchMapXMax; j++) {
            if (searchData[i][j][1] == 1) {
                searchMax += 1
            }
            
        }
    }
    // マップの要素すべて探索済みになった場合生成終了
    if (searchMax == mapMax) {
        break
    }
    
    // 上下左右確認し、どの方向が掘れるか調べる(すべての方向掘れない場合確認終了,掘れる場合掘る)
    checkCnt = 0
    checkPos1 = [0, 0]
    checkPos2 = [0, 0]
    checkDirBuffer = [0, 0, 0, 0]
    // 0南 1北 2西 3東
    isWall = false
    while (checkCnt < 4) {
        checkDir = randint(0, 3)
        while (checkDirBuffer[checkDir] != 0) {
            checkDir = randint(0, 3)
        }
        checkDirBuffer[checkDir] = 1
        checkCnt += 1
        // チェックする配列を方向に合わせて設定
        if (checkDir == 0) {
            checkPos1 = [rDigX, rDigY - 1]
            checkPos2 = [rDigX, rDigY - 2]
        } else if (checkDir == 1) {
            checkPos1 = [rDigX, rDigY + 1]
            checkPos2 = [rDigX, rDigY + 2]
        } else if (checkDir == 2) {
            checkPos1 = [rDigX - 1, rDigY]
            checkPos2 = [rDigX - 2, rDigY]
        } else if (checkDir == 3) {
            checkPos1 = [rDigX + 1, rDigY]
            checkPos2 = [rDigX + 2, rDigY]
        }
        
        // 掘れるかどうか(壁かどうか && X範囲内か && Y範囲内か)
        isWall = searchData[checkPos1[1]][checkPos1[0]][0] == 1 && searchData[checkPos2[1]][checkPos2[0]][0] == 1 && (0 < checkPos1[0] && 0 < checkPos2[0]) && (checkPos1[0] < mapX && checkPos2[0] < mapX) && (0 < checkPos1[1] && 0 < checkPos2[1]) && (checkPos1[1] < mapY && checkPos2[1] < mapY)
        // チェックした方向を設定する
        searchData[checkPos1[1]][checkPos1[0]][1] = 1
        searchData[checkPos2[1]][checkPos2[0]][1] = 1
        if (isWall) {
            // 掘ってbreak
            searchData[checkPos1[1]][checkPos1[0]][0] = 0
            searchData[checkPos2[1]][checkPos2[0]][0] = 0
            break
        }
        
    }
    // 掘れた場合掘った先（道）を起点にする
    if (isWall) {
        rdigX = checkPos2[0]
        rDigY = checkPos2[1]
        
    } else {
        // ランダムに掘りたいポイントを決める（決めたポイントがすでに）
        rDigX = randint(1, searchMapXMax)
        rDigY = randint(1, searchMapYMax)
        // 道かどうか && !(X座標が偶数か && Y座標が偶数か)でない場合もう一度探索
        while (searchData[rDigY][rDigX][1] != 0 && !(rdigX % 2 != 0 && rDigY % 2 != 0)) {
            rDigX = randint(1, searchMapXMax)
            rDigY = randint(1, searchMapYMax)
        }
    }
    
}
for (i = 0; i < mapY; i++) {
    out = ""
    for (j = 0; j < mapX; j++) {
        if (searchData[i][j][0] == 0) {
            out += " "
        } else {
            out += "■"
        }
        
    }
    player.say(out)
}

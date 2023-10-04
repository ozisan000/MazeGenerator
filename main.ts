let j: number;
let i: number;
let searchMax: number;
let checkCnt: number;
let checkDirBuffer: number[];
let isWall: boolean;
let checkDir: number;
let isIndexOutRange1: any;
let isIndexOutRange2: any;
let isIndexOut: any;
let out: string;
let mapX = 5
let mapY = 5
let worldPosY = -60
// マップ情報,探索済みかどうか
// 情報 0 = 空気 1 = 壁
// 探索状況 0 = 未探索 1 = 探索済み
let searchData = [[[1, 0]]]
let progressCount = 0
let searchMapXMax = mapX - 2
let searchMapYMax = mapY - 2
let rDigX = 0
let rDigY = 0
let mapMax = 0
let isSearch = false
for (j = 0; j < mapX - 1; j++) {
    searchData[0].push([1, 0])
}
// mapMax += 1
for (i = 1; i < mapY; i += 1) {
    searchData.push([])
    for (j = 0; j < mapX; j++) {
        searchData[i].push([1, 0])
    }
}
mapMax = Math.trunc((mapX - 2) * (mapY - 2) * 0.75)
let checkPos1 = [0, 0]
let checkPos2 = [0, 0]
function DigLoadSearch() {
    
    // player.say("------------DigLoadSearch------------")
    rDigX = randint(1, searchMapXMax)
    rDigY = randint(1, searchMapYMax)
    // 道かどうか && !(X座標が偶数か && Y座標が偶数か)でない場合もう一度探索
    while (searchData[rDigY][rDigX][0] == 1 || (rDigX % 2 == 0 || rDigY % 2 == 0)) {
        rDigX = randint(1, searchMapXMax)
        rDigY = randint(1, searchMapYMax)
    }
}

// player.say(">>Check Load... X." + rDigX + " Y." + rDigY)
// player.say(">>Done! Check Load")
player.say("<<<<------------------------Generate------------------------>>>>")
// DigLoadSearch()
while (rDigX % 2 == 0 || rDigY % 2 == 0) {
    rDigX = randint(1, searchMapXMax)
    rDigY = randint(1, searchMapYMax)
}
searchData[rDigY][rDigX][0] = 0
searchData[rDigY][rDigX][1] = 1
while (true) {
    searchMax = 0
    // 探索済みかどうか計測
    // player.say("------------Check Search------------")
    for (i = 1; i < mapY - 1; i++) {
        for (j = 1; j < mapX - 1; j++) {
            if (searchData[i][j][1] == 1) {
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
        DigLoadSearch()
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
        isWall = isIndexOut && (searchData[checkPos1[1]][checkPos1[0]][0] == 1 && searchData[checkPos2[1]][checkPos2[0]][0] == 1) && searchData[checkPos1[1]][checkPos1[0]][1] == 0 && searchData[checkPos2[1]][checkPos2[0]][1] == 0
        // player.say(">>isWall :" + isWall)
        // チェックした方向を設定する
        if (isIndexOutRange1) {
            searchData[checkPos1[1]][checkPos1[0]][1] = 1
        }
        
        // player.say(">>Search CheckPos1 : x." + checkPos1[0] + " y." + checkPos1[1])
        if (isIndexOutRange2) {
            searchData[checkPos2[1]][checkPos2[0]][1] = 1
        }
        
        // player.say(">>Search CheckPos2 : x." + checkPos2[0] + " y." + checkPos2[1])
        if (isWall) {
            // 掘ってbreak
            searchData[checkPos1[1]][checkPos1[0]][0] = 0
            searchData[checkPos2[1]][checkPos2[0]][0] = 0
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
//  for i in range(mapY):
//      out = ""
//      for j in range(mapX):
//          if searchData[i][j][0] == 0:
//              out += "　"
//          else:
//              out += "■"
//      player.say(out)
// loops.pause(500)
blocks.fill(AIR, world(0, worldPosY, 0), world(mapX, worldPosY + 3, mapY), FillOperation.Replace)
for (i = 0; i < mapY; i++) {
    out = ""
    for (j = 0; j < mapX; j++) {
        if (searchData[i][j][0] == 0) {
            out += "　"
        } else {
            out += "■"
            blocks.fill(IRON_BLOCK, world(j, worldPosY, i), world(j, worldPosY + 3, i), FillOperation.Replace)
        }
        
    }
    player.say(out)
}

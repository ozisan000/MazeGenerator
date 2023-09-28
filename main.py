mapX = 10
mapY = 10

#マップ情報,探索済みかどうか
#情報 0 = 空気 1 = 壁
#探索状況 0 = 未探索 1 = 探索済み

searchData = [
    [[1,0],],
]


searchMapXMax = mapX - 1
searchMapYMax = mapY - 1

mapMax = 0

searchData[0].pop(0)
for i in range(searchMapYMax):
    searchData.append([])
    for j in range(mapX):
        searchData[i].append([0,0])
        mapMax += 1

isEnd = False

rDigX = randint(1,searchMapXMax)
rDigY = randint(1 ,searchMapYMax)

while not isEnd:
    searchMax = 0

    #探索済みかどうか計測
    for i in range(searchMapYMax):
        for j in range(searchMapXMax):
            if searchData[i][j][1] == 1:
                searchMax += 1

    #マップの要素すべて探索済みになった場合生成終了
    if searchMax == mapMax:
        break

    #上下左右確認し、どの方向が掘れるか調べる(すべての方向掘れない場合確認終了,掘れる場合掘る)
    checkCnt = 0
    checkPos1 = [0,0]
    checkPos2 = [0,0]
    checkDirBuffer = [0,0,0,0] #0南 1北 2西 3東
    isWall = False
    while checkCnt < 4:
        checkDir = randint(0,3)
        while checkDirBuffer[checkDir] != 0:
            checkDir = randint(0,3)
        checkDirBuffer[checkDir] = 1
        checkCnt += 1

        #チェックする配列を方向に合わせて設定
        if checkDir == 0:
            checkPos1 = [rDigX,rDigY - 1]
            checkPos2 = [rDigX,rDigY - 2]
        elif checkDir == 1:
            checkPos1 = [rDigX,rDigY + 1]
            checkPos2 = [rDigX,rDigY + 2]
        elif checkDir == 2:
            checkPos1 = [rDigX - 1,rDigY]
            checkPos2 = [rDigX - 2,rDigY]
        elif checkDir == 3:
            checkPos1 = [rDigX + 1,rDigY]
            checkPos2 = [rDigX + 2,rDigY]
        
        #掘れるかどうか(壁かどうか && X範囲内か && Y範囲内か)
        isWall = (searchData[checkPos1[1]][checkPos1[0]][0] == 1 and searchData[checkPos2[1]][checkPos2[0]][0] == 1)and\
        (0 < checkPos1[0] and 0 < checkPos2[0]) and (checkPos1[0] < mapX and checkPos2[0] < mapX)and\
        (0 < checkPos1[1] and 0 < checkPos2[1]) and (checkPos1[1] < mapY and checkPos2[1] < mapY)
        #チェックした方向を設定する
        searchData[checkPos1[1]][checkPos1[0]][1] = 1
        searchData[checkPos2[1]][checkPos2[0]][1] = 1
        if isWall:#掘ってbreak
            searchData[checkPos1[1]][checkPos1[0]][0] = 0
            searchData[checkPos2[1]][checkPos2[0]][0] = 0
            break
    
    #掘れた場合掘った先（道）を起点にする
    if isWall:
        rdigX = checkPos2[0]
        rDigY = checkPos2[1]
        pass
    else:
    #ランダムに掘りたいポイントを決める（決めたポイントがすでに）
        rDigX = randint(1,searchMapXMax)
        rDigY = randint(1 ,searchMapYMax)
        #道かどうか && !(X座標が偶数か && Y座標が偶数か)でない場合もう一度探索
        while searchData[rDigY][rDigX][1] != 0 and not( rdigX % 2 != 0 and rDigY % 2 != 0):
            rDigX = randint(1,searchMapXMax)
            rDigY = randint(1 ,searchMapYMax)

for i in range(mapY):
    out = ""
    for j in range(mapX):
        if searchData[i][j][0] == 0:
            out += " "
        else:
            out += "■"
         
    player.say(out)
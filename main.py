mapX = 11
mapY = 10

#マップ情報,探索済みかどうか
#情報 0 = 空気 1 = 壁
#探索状況 0 = 未探索 1 = 探索済み

searchData = [
    [[1,0],],
]

progressCount = 0

searchMapXMax = mapX - 2
searchMapYMax = mapY - 2

rDigX = 0
rDigY = 0

mapMax = 0

for j in range(mapX - 1):
    searchData[0].append([1,0])
    mapMax += 1

for i in range(1,mapY,1):
    searchData.append([])
    for j in range(mapX):
        searchData[i].append([1,0])
        mapMax += 1

checkPos1 = [0,0]
checkPos2 = [0,0]

def DigLoadSearch():
    global rDigX,rDigY,searchMapXMax,searchMapYMax,searchData
    player.say("------------DigLoadSearch------------")
    rDigX = randint(1,searchMapXMax)
    rDigY = randint(1 ,searchMapYMax)
            #道かどうか && !(X座標が偶数か && Y座標が偶数か)でない場合もう一度探索
    while searchData[rDigY][rDigX][0] != 0 and ( rDigX % 2 != 0 or rDigY % 2 != 0):
        player.say(">>Check Load...")
        rDigX = randint(1,searchMapXMax)
        rDigY = randint(1 ,searchMapYMax)
    player.say(">>Done! Check Load" + searchData[rDigY][rDigX][0] + " !!!!!!!!!!!!!!!!!!!")

player.say("<<------------Generate------------>>")
DigLoadSearch()
searchData[rDigY][rDigX][0] = 0
while True:
    searchMax = 0
    player.say(">>Next DigPos : x." + rDigX + " y." + rDigY)
    #探索済みかどうか計測
    player.say("------------Check Search------------")
    for i in range(searchMapYMax):
        for j in range(searchMapXMax):
            if searchData[i][j][1] == 1:
                searchMax += 1
    player.say(">>Search :" + searchMax)
                

    #マップの要素すべて探索済みになった場合生成終了
    if searchMax == mapMax:
        player.say("------------Done!------------")
        break

    progressCount += 1

    player.say("Progress : " + progressCount)

    #上下左右確認し、どの方向が掘れるか調べる(すべての方向掘れない場合確認終了,掘れる場合掘る)
    checkCnt = 0
    checkDirBuffer = [0,0,0,0] #0南 1北 2西 3東
    isWall = False
    player.say("------------CheckRandomDir------------")
    while checkCnt < 4:
        checkDir = randint(0,3)
        while checkDirBuffer[checkDir] != 0:
            checkDir = randint(0,3)
        checkDirBuffer[checkDir] = 1
        checkCnt += 1

        player.say(">>Done RandomDir :" + checkDir)
        player.say(">>CheckCnt :" + checkCnt)
        player.say(">>CheckDigPos: x." + rDigX + " y." + rDigY)
        #チェックする配列を方向に合わせて設定
        if checkDir == 0:
            checkPos1[0] = rDigX
            checkPos1[1] = rDigY - 1
            checkPos2[0] = rDigX
            checkPos2[1] = rDigY - 2
        elif checkDir == 1:
            checkPos1[0] = rDigX
            checkPos1[1] = rDigY + 1
            checkPos2[0] = rDigX
            checkPos2[1] = rDigY + 2
        elif checkDir == 2:
            checkPos1[0] = rDigX - 1
            checkPos1[1] = rDigY
            checkPos2[0] = rDigX - 2
            checkPos2[1] = rDigY
        elif checkDir == 3:
            checkPos1[0] = rDigX + 1
            checkPos1[1] = rDigY
            checkPos2[0] = rDigX + 2
            checkPos2[1] = rDigY
        
        isIndexOutRange1 = (0 < checkPos1[0] and 0 < checkPos1[1]) and (checkPos1[0] < mapX - 1 and checkPos1[1] < mapY - 1)
        isIndexOutRange2 = (0 < checkPos2[0] and 0 < checkPos2[1]) and (checkPos2[0] < mapX - 1 and checkPos2[1] < mapY - 1)
        isIndexOut = isIndexOutRange1 and isIndexOutRange2
        player.say(">>isIndexOut :" + isIndexOut)

        #掘れるかどうか(壁かどうか && X範囲内か && Y範囲内か)
        isWall = isIndexOut and (searchData[checkPos1[1]][checkPos1[0]][0] == 1 and searchData[checkPos2[1]][checkPos2[0]][0] == 1) #and\
        #searchData[checkPos1[1]][checkPos1[0]][1] == 0
        player.say(">>isWall :" + isWall)
        #チェックした方向を設定する
        if isIndexOutRange1:
            searchData[checkPos1[1]][checkPos1[0]][1] = 1
            player.say(">>Search CheckPos1 : x." + checkPos1[0] + " y." + checkPos1[1])
        if isIndexOutRange2:
            searchData[checkPos2[1]][checkPos2[0]][1] = 1
            player.say(">>Search CheckPos2 : x." + checkPos2[0] + " y." + checkPos2[1])

        if isWall:#掘ってbreak
            searchData[checkPos1[1]][checkPos1[0]][0] = 0
            searchData[checkPos2[1]][checkPos2[0]][0] = 0
            player.say(">>Dig!")
            break
        player.say(">>NextCheck------------------>")

    #掘れた場合掘った先（道）を起点にする
    if isWall:
        player.say("------------Keep digging continuously------------")
        player.say(">>not keep Pos Dig: x." + rDigX + " y." + rDigY)
        rDigX = checkPos2[0]
        rDigY = checkPos2[1]
        player.say(">>keep Pos : x." + checkPos2[0] + " y." + checkPos2[1])
        player.say(">>keep Pos Dig: x." + rDigX + " y." + rDigY)
    else:
        #ランダムに掘りたいポイントを決める（決めたポイントがすでに）
        DigLoadSearch()
    
    for i in range(mapY):
        out = ""
        for j in range(mapX):
            if searchData[i][j][0] == 0:
                out += "　"
            else:
                out += "■"
             
        player.say(out)

    loops.pause(10)

for i in range(mapY):
    out = ""
    for j in range(mapX):
        if searchData[i][j][0] == 0:
            out += " "
        else:
            out += "■"
         
    player.say(out)
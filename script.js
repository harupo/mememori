// 3周年版 FGIテーブル（2025年10月データ）
const fgiTable = [
    // SS: 60億以上
    { rank: "SS", min: 0, max: 0.119, style: "分散型" },
    { rank: "SS", min: 0.119, max: 0.133, style: "バランス型" },
    { rank: "SS", min: 0.133, max: 1.0, style: "集中型" },
    // S: 30億〜59億
    { rank: "S", min: 0, max: 0.138, style: "分散型" },
    { rank: "S", min: 0.138, max: 0.158, style: "バランス型" },
    { rank: "S", min: 0.158, max: 1.0, style: "集中型" },
    // A: 10億〜29億
    { rank: "A", min: 0, max: 0.168, style: "分散型" },
    { rank: "A", min: 0.168, max: 0.194, style: "バランス型" },
    { rank: "A", min: 0.194, max: 1.0, style: "集中型" },
    // B: 5億〜9億
    { rank: "B", min: 0, max: 0.207, style: "分散型" },
    { rank: "B", min: 0.207, max: 0.228, style: "バランス型" },
    { rank: "B", min: 0.228, max: 1.0, style: "集中型" },
    // C: 5億未満
    { rank: "C", min: 0, max: 0.238, style: "分散型" },
    { rank: "C", min: 0.238, max: 0.274, style: "バランス型" },
    { rank: "C", min: 0.274, max: 1.0, style: "集中型" },
];

// カラースキーム（#b8daff基準）
const mapColors = {
    base: '#b8daff',
    dark: '#5a9fd4',
    darker: '#3d87c4',
    darkest: '#2670a8',
    areaRed: '#ffb8b8',
    areaYellow: '#ffe4b8',
    areaGreen: '#b8ffce',
    labelRed: '#d45a5a',
    labelYellow: '#d4a43d',
    labelGreen: '#3db870',
    text: '#1a4971',
    textLight: '#4a7a9e',
    bg: '#ffffff',
    bgArea: '#f0f7ff',
};

// FGIマップを描画
function drawFgiMap(fgi, levelPower, rank, style) {
    const fgiMap = document.getElementById("fgi_map");
    
    // レベルリンク戦闘力を億単位に変換
    const powerInOku = levelPower / 1e8;
    
    // 現在のランクのFGI閾値を取得（プレイヤー位置計算用）
    const rankThresholds = fgiTable.filter(row => row.rank === rank);
    const dispersedMax = rankThresholds.find(r => r.style === "分散型")?.max || 0.15;
    const balancedMax = rankThresholds.find(r => r.style === "バランス型")?.max || 0.25;
    
    // FGI上限（表示用）
    const fgiMax = 0.35;
    
    // エリアは3等分（固定）
    const topY = 40;
    const bottomY = 270;
    const areaHeight = (bottomY - topY) / 3;
    const balancedY = topY + areaHeight;        // 集中とバランスの境界
    const dispersedY = topY + areaHeight * 2;   // バランスと分散の境界
    
    // プレイヤーのY座標は実際のFGI閾値に基づいて計算
    // 分散エリア: FGI 0 ～ dispersedMax → Y: bottomY ～ dispersedY
    // バランスエリア: FGI dispersedMax ～ balancedMax → Y: dispersedY ～ balancedY
    // 集中エリア: FGI balancedMax ～ fgiMax → Y: balancedY ～ topY
    let playerY;
    if (fgi <= dispersedMax) {
        // 分散エリア内
        const ratio = fgi / dispersedMax;
        playerY = bottomY - ratio * areaHeight;
    } else if (fgi <= balancedMax) {
        // バランスエリア内
        const ratio = (fgi - dispersedMax) / (balancedMax - dispersedMax);
        playerY = dispersedY - ratio * areaHeight;
    } else {
        // 集中エリア内
        const ratio = Math.min((fgi - balancedMax) / (fgiMax - balancedMax), 1);
        playerY = balancedY - ratio * areaHeight;
    }
    
    // X座標計算（5等分均等幅）
    // グラフ領域: 65-465 (幅400)、各ランク幅80
    const graphLeft = 65;
    const rankWidth = 80;
    
    let playerX;
    if (powerInOku < 5) {
        // C領域: 65-145
        playerX = graphLeft + (powerInOku / 5) * rankWidth;
    } else if (powerInOku < 10) {
        // B領域: 145-225
        playerX = graphLeft + rankWidth + ((powerInOku - 5) / 5) * rankWidth;
    } else if (powerInOku < 30) {
        // A領域: 225-305
        playerX = graphLeft + rankWidth * 2 + ((powerInOku - 10) / 20) * rankWidth;
    } else if (powerInOku < 60) {
        // S領域: 305-385
        playerX = graphLeft + rankWidth * 3 + ((powerInOku - 30) / 30) * rankWidth;
    } else {
        // SS領域: 385-465
        playerX = graphLeft + rankWidth * 4 + Math.min((powerInOku - 60) / 40, 1) * rankWidth;
    }
    
    // ステータスボックスの位置計算（グラフ内に収める）
    const boxWidth = 120;
    const boxHeight = 80;
    const graphRight = 465;
    const graphTop = 40;
    const graphBottom = 270;
    const margin = 10;
    
    // デフォルトは右側に表示
    let boxX = playerX + 45;
    let boxY = playerY - 40;
    let lineStartX = playerX + 24;
    let lineEndX = playerX + 45;
    let lineY = playerY;
    
    // 右側にスペースがない場合は左側に表示
    if (playerX + 45 + boxWidth > graphRight - margin) {
        boxX = playerX - 45 - boxWidth;
        lineStartX = playerX - 24;
        lineEndX = playerX - 45;
    }
    
    // 下にはみ出る場合は上に調整
    if (boxY + boxHeight > graphBottom - margin) {
        boxY = graphBottom - margin - boxHeight;
    }
    
    // 上にはみ出る場合は下に調整
    if (boxY < graphTop + margin) {
        boxY = graphTop + margin;
    }
    
    // SVG生成（横幅をコンテナいっぱいに）
    const svgContent = `
    <svg width="100%" viewBox="0 0 520 340" style="max-width: 520px;">
        <defs>
            <!-- 丸角クリップパス -->
            <clipPath id="graphClip">
                <rect x="65" y="40" width="400" height="230" rx="10" ry="10"/>
            </clipPath>
        </defs>
        
        <!-- 背景（丸角） -->
        <rect x="65" y="40" width="400" height="230" fill="${mapColors.bgArea}" rx="10"/>
        
        <!-- エリア分け（クリップで丸角内に収める、3等分固定） -->
        <g clip-path="url(#graphClip)">
            <rect x="65" y="${topY + areaHeight * 2}" width="400" height="${areaHeight}" fill="${mapColors.areaGreen}" opacity="0.6"/>
            <rect x="65" y="${topY + areaHeight}" width="400" height="${areaHeight}" fill="${mapColors.areaYellow}" opacity="0.6"/>
            <rect x="65" y="${topY}" width="400" height="${areaHeight}" fill="${mapColors.areaRed}" opacity="0.6"/>
        </g>
        
        <!-- 縦区切り（ランク境界、均等幅） -->
        <line x1="145" y1="40" x2="145" y2="270" stroke="${mapColors.base}" stroke-width="1"/>
        <line x1="225" y1="40" x2="225" y2="270" stroke="${mapColors.base}" stroke-width="1"/>
        <line x1="305" y1="40" x2="305" y2="270" stroke="${mapColors.base}" stroke-width="1"/>
        <line x1="385" y1="40" x2="385" y2="270" stroke="${mapColors.base}" stroke-width="1"/>
        
        <!-- 横区切り（FGIエリア境界、3等分） -->
        <line x1="65" y1="${topY + areaHeight}" x2="465" y2="${topY + areaHeight}" stroke="${mapColors.base}" stroke-width="1" stroke-dasharray="4,2"/>
        <line x1="65" y1="${topY + areaHeight * 2}" x2="465" y2="${topY + areaHeight * 2}" stroke="${mapColors.base}" stroke-width="1" stroke-dasharray="4,2"/>
        
        <!-- 外枠 -->
        <rect x="65" y="40" width="400" height="230" fill="none" stroke="${mapColors.dark}" stroke-width="2" rx="10"/>

        <!-- フォーカスフレーム -->
        <g class="focus-frame" id="focusFrame">
            <path d="M${playerX - 20} ${playerY - 7} L${playerX - 20} ${playerY - 20} L${playerX - 7} ${playerY - 20}" 
                  fill="none" stroke="${mapColors.darker}" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M${playerX + 7} ${playerY - 20} L${playerX + 20} ${playerY - 20} L${playerX + 20} ${playerY - 7}" 
                  fill="none" stroke="${mapColors.darker}" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M${playerX - 20} ${playerY + 7} L${playerX - 20} ${playerY + 20} L${playerX - 7} ${playerY + 20}" 
                  fill="none" stroke="${mapColors.darker}" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M${playerX + 7} ${playerY + 20} L${playerX + 20} ${playerY + 20} L${playerX + 20} ${playerY + 7}" 
                  fill="none" stroke="${mapColors.darker}" stroke-width="3.5" stroke-linecap="round"/>
            
            <!-- 中心点 -->
            <circle cx="${playerX}" cy="${playerY}" r="8" fill="${mapColors.darkest}"/>
        </g>
        
        <!-- ステータスボックス -->
        <g class="status-box" id="statusBox">
            <line x1="${lineStartX}" y1="${lineY}" x2="${lineEndX}" y2="${lineY}" stroke="${mapColors.dark}" stroke-width="2"/>
            <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="${mapColors.bg}" stroke="${mapColors.darker}" stroke-width="2" rx="6"/>
            <text x="${boxX + boxWidth/2}" y="${boxY + 22}" text-anchor="middle" fill="${mapColors.darkest}" font-size="14" font-weight="bold">YOU</text>
            <line x1="${boxX + 8}" y1="${boxY + 32}" x2="${boxX + boxWidth - 8}" y2="${boxY + 32}" stroke="${mapColors.base}" stroke-width="1"/>
            <text x="${boxX + 12}" y="${boxY + 52}" fill="${mapColors.textLight}" font-size="14">FGI:</text>
            <text x="${boxX + boxWidth - 12}" y="${boxY + 52}" text-anchor="end" fill="${mapColors.text}" font-size="15" font-weight="bold">${fgi.toFixed(3)}</text>
            <text x="${boxX + 12}" y="${boxY + 72}" fill="${mapColors.textLight}" font-size="14">PWR:</text>
            <text x="${boxX + boxWidth - 12}" y="${boxY + 72}" text-anchor="end" fill="${mapColors.text}" font-size="15" font-weight="bold">${powerInOku.toFixed(1)}億</text>
        </g>

        <!-- ランクラベル（均等幅の中央） -->
        <text x="105" y="300" fill="${mapColors.textLight}" font-size="16" text-anchor="middle">C</text>
        <text x="185" y="300" fill="${mapColors.textLight}" font-size="16" text-anchor="middle">B</text>
        <text x="265" y="300" fill="${mapColors.textLight}" font-size="16" text-anchor="middle">A</text>
        <text x="345" y="300" fill="${mapColors.textLight}" font-size="16" text-anchor="middle">S</text>
        <text x="425" y="300" fill="${mapColors.textLight}" font-size="16" text-anchor="middle">SS</text>
        
        <!-- 軸ラベル -->
        <text x="265" y="328" fill="${mapColors.textLight}" font-size="13" text-anchor="middle">レベルリンク戦闘力 →</text>
        
        <!-- FGIラベル（3等分の各エリア中央） -->
        <text x="55" y="${topY + areaHeight / 2 + 5}" fill="${mapColors.labelRed}" font-size="13" text-anchor="end">集中</text>
        <text x="55" y="${topY + areaHeight * 1.5 + 5}" fill="${mapColors.labelYellow}" font-size="13" text-anchor="end">バランス</text>
        <text x="55" y="${topY + areaHeight * 2.5 + 5}" fill="${mapColors.labelGreen}" font-size="13" text-anchor="end">分散</text>
    </svg>
    `;
    
    // SVGをPNG画像に変換して表示
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function() {
        // Canvas作成
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // 高解像度で出力（2倍）
        const scale = 2;
        canvas.width = 520 * scale;
        canvas.height = 340 * scale;
        ctx.scale(scale, scale);
        
        // 背景を白に
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 520, 340);
        
        // SVGを描画
        ctx.drawImage(img, 0, 0, 520, 340);
        URL.revokeObjectURL(url);
        
        // PNGとして表示
        const pngUrl = canvas.toDataURL("image/png");
        const resultImg = document.createElement("img");
        resultImg.src = pngUrl;
        resultImg.style.maxWidth = "100%";
        resultImg.style.borderRadius = "10px";
        
        fgiMap.innerHTML = "";
        fgiMap.appendChild(resultImg);
        fgiMap.style.display = "flex";
    };
    
    img.src = url;
}

function diagnose() {
    const levelPower = Number(document.getElementById("levelPower").value);

    // 5体の戦闘力を取得して合計を計算
    const battlePowerInputs = [
        Number(document.getElementById("battlePower1").value),
        Number(document.getElementById("battlePower2").value),
        Number(document.getElementById("battlePower3").value),
        Number(document.getElementById("battlePower4").value),
        Number(document.getElementById("battlePower5").value),
    ];
    const battlePower = battlePowerInputs.reduce((sum, value) => sum + value, 0);

    const output = document.getElementById("output");
    const share = document.getElementById("share");
    const options = document.getElementById("options");
    const fgiDetails = document.getElementById("fgi_details");
    const fgiInfo = document.getElementById("fgi_info");
    const rankDefinitions = document.getElementById("rank_definitions");
    const additionalInfo = document.getElementById("additional_info");
    const nextRankInfo = document.getElementById("next_rank_info");
    const nextStyleInfo = document.getElementById("next_style_info");
    const fgiMap = document.getElementById("fgi_map");
    const shareArea = document.getElementById("share_area");

    // Reset output and other elements
    output.style.display = "none";
    output.innerHTML = "";
    share.style.display = "none";
    share.innerHTML = "";
    options.style.display = "none";
    fgiInfo.style.display = "none";
    fgiDetails.innerHTML = "";
    rankDefinitions.style.display = "none";
    additionalInfo.style.display = "none";
    fgiMap.style.display = "none";
    fgiMap.innerHTML = "";
    shareArea.style.display = "none";

    if (!levelPower || battlePowerInputs.some((value) => !value)) {
        output.innerText =
            "レベルリンク戦闘力と5体の戦闘力をすべて入力してください。";
        output.style.display = "block";
        return;
    }

    if (battlePower >= levelPower) {
        output.innerText =
            "バトリ編成5体合計は、レベルリンク戦闘力より小さい必要があります。";
        output.style.display = "block";
        return;
    }

    if (levelPower >= 100000000000 || battlePower >= 100000000000) {
        output.innerText = "戦闘力は1000億未満にしてください。";
        output.style.display = "block";
        return;
    }

    const fgi = battlePower / levelPower;
    let rank = "C";
    if (levelPower >= 6000000000) rank = "SS";
    else if (levelPower >= 3000000000) rank = "S";
    else if (levelPower >= 1000000000) rank = "A";
    else if (levelPower >= 500000000) rank = "B";

    const match = fgiTable.find(
        (row) => row.rank === rank && fgi >= row.min && fgi < row.max
    );
    const style = match ? match.style : "不明";

    output.innerHTML = `
      <strong>FGI(集中育成指数):</strong> ${fgi.toFixed(3)}<br>
      <strong>ランク:</strong> ${rank}<br>
      <strong>育成スタイル:</strong> ${style}
    `;
    output.style.display = "block";
    options.style.display = "block";
    
    // FGIマップを描画
    drawFgiMap(fgi, levelPower, rank, style);

    const rankDetails = fgiTable
        .filter((row) => row.rank === rank)
        .map(
            (row) => `
        <tr>
          <td>${row.rank}</td>
          <td>${row.min.toFixed(3)} - ${row.max.toFixed(3)}</td>
          <td>${row.style}</td>
        </tr>
      `
        )
        .join("");

    fgiDetails.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ランク</th>
            <th>FGI範囲</th>
            <th>育成スタイル</th>
          </tr>
        </thead>
        <tbody>
          ${rankDetails}
        </tbody>
      </table>
    `;

    fgiInfo.style.display = "block";
    rankDefinitions.style.display = "block";

    // Highlight the matching rank row in "ランクの定義"
    const rankDefinitionsTable = document.querySelector(
        "#rank_definitions tbody"
    );
    const rankRows = rankDefinitionsTable.querySelectorAll("tr");

    // Remove existing highlights
    rankRows.forEach((row) => row.classList.remove("highlight"));

    // Highlight the matching rank row
    rankRows.forEach((row) => {
        if (row.querySelector("td")?.innerText === rank) {
            row.classList.add("highlight");
        }
    });

    // Highlight the matching FGI row in "判定ランクにおけるFGIと育成スタイル"
    const fgiDetailsTable = document.querySelector("#fgi_details tbody");
    const fgiRows = fgiDetailsTable.querySelectorAll("tr");

    // Remove existing highlights
    fgiRows.forEach((row) => row.classList.remove("highlight"));

    // Highlight the matching FGI row
    fgiRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rankCell = cells[0]?.innerText;
        const rangeCell = cells[1]?.innerText.split(" - ");
        const min = parseFloat(rangeCell[0]);
        const max = parseFloat(rangeCell[1]);

        if (rankCell === rank && fgi >= min && fgi < max) {
            row.classList.add("highlight");
        }
    });

    // Additional Info: Next Rank and Style
    const nextRank = fgiTable.find(
        (row) => row.rank === rank && fgi >= row.min && fgi < row.max + 0.001
    );
    if (nextRank) {
        nextRankInfo.innerText = `次のランク: ${nextRank.rank
            } (${nextRank.min.toFixed(3)} - ${nextRank.max.toFixed(3)})`;
        nextStyleInfo.innerText = `次の育成スタイル: ${nextRank.style}`;
        additionalInfo.style.display = "block";
    }

    // Calculate additional information
    // Calculate the next rank
    let nextRankName = "";
    let nextRankThreshold = 0;

    if (rank === "C") {
        nextRankName = "B";
        nextRankThreshold = 500000000;
    } else if (rank === "B") {
        nextRankName = "A";
        nextRankThreshold = 1000000000;
    } else if (rank === "A") {
        nextRankName = "S";
        nextRankThreshold = 3000000000;
    } else if (rank === "S") {
        nextRankName = "SS";
        nextRankThreshold = 6000000000;
    }

    // Calculate the next rank
    if (nextRankName) {
        const remainingPower = ((nextRankThreshold - levelPower) / 1e8).toFixed(1);
        nextRankInfo.innerHTML = `あなたは…
    <ul>
      <li>次のレベルリンク戦闘力ランクまで、あと${remainingPower}億</li>
    </ul>
  `;
    } else {
        nextRankInfo.innerHTML = `あなたは…
    <ul>
      <li>すでに最高ランクです！</li>
    </ul>
  `;
    }

    // Calculate the next style
    if (match) {
        const currentIndex = fgiTable.findIndex(
            (row) => row.rank === rank && row.style === style
        );
        const nextRow = fgiTable[currentIndex + 1];
        const prevRow = fgiTable[currentIndex - 1];

        if (nextRow && nextRow.rank === rank) {
            const fgiChange = (nextRow.min - fgi).toFixed(3);
            nextStyleInfo.innerHTML = `
      <ul>
        <li>FGIが${fgiChange}増加すると、${nextRow.style}になります</li>
      </ul>
    `;
        } else if (prevRow && prevRow.rank === rank) {
            const fgiChange = (fgi - prevRow.max).toFixed(3);
            nextStyleInfo.innerHTML = `
      <ul>
        <li>FGIが${fgiChange}減少すると、${prevRow.style}になります</li>
      </ul>
    `;
        } else {
            nextStyleInfo.innerHTML = `
      <ul>
        <li>FGIの変化による育成スタイルの変更はありません。</li>
      </ul>
    `;
        }
    }

    additionalInfo.style.display = "block";

    const includeDetails = document.getElementById("includeDetails").checked;
    let shareText = `【メメントモリ育成スタイル診断結果】\n\n育成スタイル: ${style}\n\nFGI(集中育成指数): ${fgi.toFixed(
        3
    )}\nレベルリンク戦闘力ランク: ${rank}`;

    if (includeDetails) {
        shareText += `\n\nレベルリンク戦闘力: ${(levelPower / 1e8).toFixed(
            1
        )}億\nバトリ編成5体合計 : ${(battlePower / 1e8).toFixed(1)}億`;
    }

    shareText += `\n\nhttps://harupo.github.io/mememori/`;

    const encodedText = encodeURIComponent(shareText);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    share.innerHTML = `<a href="${shareUrl}" target="_blank"><span class="material-icons">share</span>Xでシェアする</a>`;
    share.style.display = "block";
    shareArea.style.display = "block";
}
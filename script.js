// JavaScriptコードをここに移動
const fgiTable = [
    { rank: "SS", min: 0, max: 0.126, style: "超分散型～分散型" },
    { rank: "SS", min: 0.126, max: 0.132, style: "バランス分散型" },
    { rank: "SS", min: 0.132, max: 1.0, style: "準メイン集中型～メイン集中型" },
    { rank: "S", min: 0, max: 0.146, style: "超分散型～分散型" },
    { rank: "S", min: 0.146, max: 0.162, style: "バランス分散型" },
    { rank: "S", min: 0.162, max: 1.0, style: "準メイン集中型～メイン集中型" },
    { rank: "A", min: 0, max: 0.164, style: "超分散型～分散型" },
    { rank: "A", min: 0.164, max: 0.215, style: "バランス分散型" },
    { rank: "A", min: 0.215, max: 1.0, style: "準メイン集中型～メイン集中型" },
    { rank: "B", min: 0, max: 0.188, style: "超分散型～分散型" },
    { rank: "B", min: 0.188, max: 0.242, style: "バランス分散型" },
    { rank: "B", min: 0.242, max: 1.0, style: "準メイン集中型～メイン集中型" },
    { rank: "C", min: 0, max: 0.23, style: "超分散型～分散型" },
    { rank: "C", min: 0.23, max: 0.278, style: "バランス分散型" },
    { rank: "C", min: 0.278, max: 1.0, style: "準メイン集中型～メイン集中型" },
];

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
}

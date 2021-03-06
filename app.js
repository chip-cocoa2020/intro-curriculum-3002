'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const prefectureDataMap = new Map(); // key: 都道府県名 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = columns[0];
    const prefecture = columns[2];
    const population = columns[7];
    if (year === '2010' || year === '2015') {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                population_2010: 0,//2010年の人口
                population_2015: 0,//2015年の人口
                ratio_2010To2015: null//2015年人口の2010年人口に対する比
            };
        }
        if (year === '2010') {
            value.population_2010 += parseInt(population);
        }
        if (year === '2015') {
            value.population_2015 += parseInt(population);
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.ratio_2010To2015 = value.population_2015 / value.population_2010;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].ratio_2010To2015 - pair1[1].ratio_2010To2015;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.population_2010 + '=>' + value.population_2015 + ' 変化率:' + value.ratio_2010To2015;
    });
    console.log(rankingStrings);
});

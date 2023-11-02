import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

let App = () => {
    let [initData, setInitData] = useState({
        l: {el1: 0.7, el2: 0.83, el3: 0.06, el4: 0.1, el5: 0.53, el6: 0.79, el7: 0.36, el8: 0.56},
        m: {el1: 0.2, el2: 0.5, el3: 0.7, el4: 0.4, el5: 0.9, el6: 0.5, el7: 0.2, el8: 0.5},
        r: {el1: 500, el2: 39, el3: 5279, el4: 463, el5: 890, el6: 10000, el7: 76, el8: 145},
        T: 6000,
        R: 1300,
        time: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    });

    let setInitL = (l, key) => {
        l = parseFloat(l);
        let newLObj = {...initData.l};
        newLObj[key] = l;
        setInitData({...initData, l: newLObj});
    };

    let setInitM = (m, key) => {
        m = parseFloat(m);
        let newMObj = {...initData.m};
        newMObj[key] = m;
        setInitData({...initData, m: newMObj});
    };

    let setInitR = (r, key) => {
        r = parseFloat(r);
        let newRObj = {...initData.r};
        newRObj[key] = r;
        setInitData({...initData, r: newRObj});
    };

    let LSum = 0;
    Object.values(initData.l).forEach(l => {
        LSum += l
    });
    let TAvg = (Math.pow(10, 4)) / (LSum);
    LSum = LSum * Math.pow(10, -4);
    let ReadinessCoeff;
    let LDivideMSum = 0;
    Object.keys(initData.l).forEach(el => {
       LDivideMSum += (initData.l[el] / initData.m[el]);
    });
    ReadinessCoeff = 1 / (1 + LDivideMSum);
    let MAvg = LSum / LDivideMSum;

    let calculateReadinessFunction = (time) => {
        return (MAvg / (LSum + MAvg)) +
            (LSum / (LSum + MAvg) *
                Math.exp(-1 * (LSum + MAvg) * time));
    }

    let systemRisk = 0;
    Object.keys(initData.l).forEach(el => {
        systemRisk += initData.l[el] * initData.r[el];
    });
    systemRisk = systemRisk * Math.pow(10, -4);

    let Risk = 1000 * ((ReadinessCoeff * systemRisk) + systemRisk) / 2;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const data = {
        labels: initData.time,
        datasets: [
            {
                label: 'Dataset 1',
                data: initData.time.map((time) => calculateReadinessFunction(time)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return(
        <div className="row">
            <div className="col-4">
                <h4>Set all params:</h4>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-3 text-center">L</div>
                    <div className="col-3 text-center">M</div>
                    <div className="col-3 text-center">R</div>
                </div>
                {Object.keys(initData.l).map((el) => {
                    return (
                        <div className="row" key={el}>
                            <div className="col-1">
                                #{el}
                            </div>
                            <div className="col-3">
                                <input type="number" step="0.1" min="0" value={initData.l[el]} onChange={(e) => {setInitL(e.target.value, el)}} className="form-control" placeholder="l" aria-label="l" />
                            </div>
                            <div className="col-3">
                                <input type="number" step="0.1" min="0" value={initData.m[el]} onChange={(e) => {setInitM(e.target.value, el)}} className="form-control" placeholder="m" aria-label="m" />
                            </div>
                            <div className="col-3">
                                <input type="number" step="1" min="0" value={initData.r[el]} onChange={(e) => {setInitR(e.target.value, el)}} className="form-control" placeholder="r" aria-label="r" />
                            </div>
                        </div>
                    );
                })}

            </div>
            <div className="col-4">
                <Line options={options} data={data} />
            </div>
            <div className="col-4">
                <h3>Average time: {TAvg}</h3>
                <h3>Readiness coefficient: {ReadinessCoeff}</h3>
                <h3>System risk: {systemRisk}</h3>
                <h3>Risk: {Risk}</h3>
            </div>
        </div>
    );
};

export default App;
import {Link} from "react-router-dom";
import {selectCurrentToken, setCredentials, selectCurrentUser} from "../auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import { useNavigate } from 'react-router-dom'
import {logOut} from "../auth/authSlice";
import React from "react";

const Graph = () => {
    const errRef = useRef()
    const [xCoord, setXCoord] = useState(0)
    const [yCoord, setYCoord] = useState('')
    const [radius, setRadius] = useState(1)
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const [points, setPoints] = useState(null)
    const [len, setLen] = useState(36)
    const dispatch = useDispatch()

    const token = useState(selectCurrentToken)
    const userLogin = useState(selectCurrentUser)


    useEffect(() => {
        setErrMsg('')
    }, [xCoord, yCoord, radius, points])
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (yCoord > 3 || yCoord < -5 || isNaN(yCoord)) {
                throw new Error('Y must be in range -5 to 3')
            }
            const response = await fetch('http://localhost:8080/api/points/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                },
                body: JSON.stringify({ x: xCoord, y: yCoord, r: radius, userLogin: userLogin[0] }),
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const point = await response.json()

            const tableReq = await fetch('http://localhost:8080/api/points/get_points', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            })

            if (!tableReq.ok) {
                throw new Error('Request failed');
            }

            setPoints(await tableReq.json())
        } catch (err) {
            if (!err?.response) {
                setErrMsg(err.toString());
            } else {
                setErrMsg('Database error');
            }
        }
    }

    const handleClick = async (event) => {
        const rect = document.getElementById("blueGraph").getBoundingClientRect()

        const localX = event.clientX - rect.x;
        const localY = event.clientY - rect.y;

        const x = (localX - 200) / 36;
        const y = (200 - localY) / 36;



        try {
            const response = await fetch('http://localhost:8080/api/points/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                },
                body: JSON.stringify({ x: x, y: y, r: radius, userLogin: userLogin[0] }),
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const point = await response.json()

            const tableReq = await fetch('http://localhost:8080/api/points/get_points', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            })

            if (!tableReq.ok) {
                throw new Error('Request failed');
            }

            setPoints(await tableReq.json())
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 403) {
                setErrMsg('Unauthorized');
                navigate("/")
            } else {
                setErrMsg('Database error');
                navigate("/")
            }
        }
    }

    const handleYCoordInput = (e) => setYCoord(e.target.value)
    const handleXCoordInput = (e) => setXCoord(e.target.value)
    const handleRadiusInput = (e) => {
        setRadius(e.target.value)
        setLen(180 / 5 * e.target.value)
    }

    const showResults = async (e) => {
        e.preventDefault()

        try {
            const tableReq = await fetch('http://localhost:8080/api/points/get_points', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            })

            if (!tableReq.ok) {
                throw new Error('Request failed');
            }

            setPoints(await tableReq.json())
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 403) {
                setErrMsg('Unauthorized');
                navigate("/")
            } else {
                setErrMsg('Database error');
                navigate("/")
            }
        }
    }

    const deleteResults = async (e) => {
        e.preventDefault()

        try {
            const tableReq = await fetch('http://localhost:8080/api/points/delete_points', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token[0]}`
                }
            })

            if (!tableReq.ok) {
                throw new Error('Request failed');
            }

            setPoints(null)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 403) {
                setErrMsg('Unauthorized');
                navigate("/")
            } else {
                setErrMsg('Database error');
                navigate("/")
            }
        }
    }

    const goToLogin = (e) => {
        e.preventDefault()

        dispatch(logOut)
        navigate("/")
    }

    const content = (<section className="graph">
            <h1>Graph page</h1>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <svg width="400" height="400" id="blueGraph" onClick={handleClick}>
                <line x1="0" y1="200" x2="400" y2="200" stroke="black"/>
                <line x1="200" y1="0" x2="200" y2="400" stroke="black"/>

                <line x1="400" y1="200" x2="390" y2="195" stroke="black"/>
                <line x1="400" y1="200" x2="390" y2="205" stroke="black"/>
                <line x1="200" y1="0" x2="205" y2="10" stroke="black"/>
                <line x1="200" y1="0" x2="195" y2="10" stroke="black"/>

                <text x="385" y="215">x</text>
                <text x="185" y="15">y</text>

                <text x="159" y="185">-1</text>
                <line x1="164" y1="195" x2="164" y2="205" stroke="black"/>
                <text x="123" y="185">-2</text>
                <line x1="128" y1="195" x2="128" y2="205" stroke="black"/>
                <text x="87" y="185">-3</text>
                <line x1="92" y1="195" x2="92" y2="205" stroke="black"/>
                <text x="51" y="185">-4</text>
                <line x1="56" y1="195" x2="56" y2="205" stroke="black"/>
                <text x="15" y="185">-5</text>
                <line x1="20" y1="195" x2="20" y2="205" stroke="black"/>

                <text x="230" y="185">1</text>
                <line x1="236" y1="195" x2="236" y2="205" stroke="black"/>
                <text x="267" y="185">2</text>
                <line x1="272" y1="195" x2="272" y2="205" stroke="black"/>
                <text x="303" y="185">3</text>
                <line x1="308" y1="195" x2="308" y2="205" stroke="black"/>
                <text x="339" y="185">4</text>
                <line x1="344" y1="195" x2="344" y2="205" stroke="black"/>
                <text x="375" y="185">5</text>
                <line x1="380" y1="195" x2="380" y2="205" stroke="black"/>

                <text x="215" y="164">1</text>
                <line x1="195" y1="164" x2="205" y2="164" stroke="black"/>
                <text x="215" y="128">2</text>
                <line x1="195" y1="128" x2="205" y2="128" stroke="black"/>
                <text x="215" y="92">3</text>
                <line x1="195" y1="92" x2="205" y2="92" stroke="black"/>
                <text x="215" y="56">4</text>
                <line x1="195" y1="56" x2="205" y2="56" stroke="black"/>
                <text x="215" y="20">5</text>
                <line x1="195" y1="20" x2="205" y2="20" stroke="black"/>

                <text x="215" y="236">-1</text>
                <line x1="195" y1="236" x2="205" y2="236" stroke="black"/>
                <text x="215" y="272">-2</text>
                <line x1="195" y1="272" x2="205" y2="272" stroke="black"/>
                <text x="215" y="308">-3</text>
                <line x1="195" y1="308" x2="205" y2="308" stroke="black"/>
                <text x="215" y="344">-4</text>
                <line x1="195" y1="344" x2="205" y2="344" stroke="black"/>
                <text x="215" y="380">-5</text>
                <line x1="195" y1="380" x2="205" y2="380" stroke="black"/>
                <polygon points={'200,200 ' + (200 - len / 2) + ",200 200," + (200 + len)} fill='#05A1FF'/>

                {
                    len > 0 ?
                        <rect x={200 - len} y={200 - len} width={len} height={len} fill='#05A1FF'/> :
                        <rect x='200' y='200' width={-len} height={-len} fill='#05A1FF'/>
                }
                <path
                    d={'M' + (200 + len) + ' 200 A' + len + ' ' + len + ' 0 0 0 200 ' + (200 - len) + ' L200 200 L' + (200 + len) + ' 200 Z'}
                    fill='#05A1FF'/>


                {points != null ? (points.map((point, index) => (
                    <circle key={index} cx={200 + point.x * 36} cy={200 - point.y * 36} r="5"
                            fill={point.inArea ? '#00FF00' : '#FF0000'}/>
                ))) : ''}
            </svg>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="xcoord">изменение X:</label>
                    <select id="xcoord" name="xcoord" className="xcoord" onChange={handleXCoordInput}
                            defaultValue={xCoord}>
                        <option value="-5">-5</option>
                        <option value="-4">-4</option>
                        <option value="-3">-3</option>
                        <option value="-2">-2</option>
                        <option value="-1">-1</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="ycoord">изменение Y:</label>
                    <input name="ycoord"
                           type="text"
                           id="ycoord"
                           value={yCoord}
                           onChange={handleYCoordInput}
                           autoComplete="off"
                           required/>
                </div>
                <div>
                    <label htmlFor="radius">изменение R:</label>
                    <select id="radius" name="radius" className="radius" onChange={handleRadiusInput}
                            defaultValue={radius}>
                        <option value="-5">-5</option>
                        <option value="-4">-4</option>
                        <option value="-3">-3</option>
                        <option value="-2">-2</option>
                        <option value="-1">-1</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <button type="submit">Отправить значения</button>
                </div>
            </form>
            <button onClick={showResults}>
                {'Show previous results'}
            </button>
            <button onClick={deleteResults}>
                {'Delete previous results'}
            </button>
            <table>
                <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Результат</th>
                </tr>
                </thead>
                <tbody id="results">
                {
                    points != null ? (
                        points.map((point, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>{point.x}</td>
                                    <td>{point.y}</td>
                                    <td>{point.r}</td>
                                    <td>{point.inArea ? 'Попадает' : 'Не попадает'}</td>
                                </tr>
                            </React.Fragment>
                        ))
                    ) : null
                }
                </tbody>
            </table>
            <button onClick={goToLogin}>
                {'Go to login'}
            </button>
        </section>
    )
    return content

}

export default Graph
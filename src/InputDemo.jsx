import { Input, Table } from 'antd';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from './atom';
import { produce } from 'immer';
function setValueKey(data, key, value) {
    for (let i of data) {
        if (i.key === key) {
            i.value = value;
            break
        }
        if (i.attributes && i.attributes.length > 0) {
            setValueKey(i.attributes, key, value);
        }
        if (i.group && i.group.length > 0) {
            i.group = setValueKey(i.group, key, value)
        }
    }

    return data;
}
function InputDemo({ keyRender, value = "" }) {
    const setDemo = useSetRecoilState(userState);
    const [values, setValues] = useState(value);

    return (
        <div>
            <Input value={values} onChange={(e) => {
                const value = e.target.value;
                setValues(value)
            }} onBlur={(e) => {
                const value = e.target.value;
                setDemo(produce((draft) => {
                    return setValueKey(draft, keyRender, value)
                }))
            }} />

        </div>
    );
}

export default InputDemo;
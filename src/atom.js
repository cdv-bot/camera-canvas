import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import demo from "./demo.json"
import { nanoid } from 'nanoid';
import { produce } from 'immer';

function renderKey(data) {
    return data.map(baseState => {
        const nextState = produce(baseState, i => {
            i.key = nanoid()
            if (i.value && Array.isArray(i.value)) {
                i.value = i.value.map(i => {
                    i.key = nanoid(10);
                    return i
                })
            }
            if (i.attributes && i.attributes.length > 0) {
                i.attributes = i.attributes.map(i => {
                    i.key = nanoid(10);
                    return i
                })
            }
            if (i.groups && i.groups.length > 0) {
                i.groups = renderKey(i.groups)
            }
        })
        return nextState
    })

}
export const userState = atom({
    key: 'userState',
    default: renderKey(demo.groupAttributes),  // Giá trị mặc định có thể là null hoặc một object rỗng
});

export const userDetailSelector = selectorFamily({
    key: 'userDetailSelector',
    get: (userId) => async ({ get }) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`);
        const data = await response.json();
        return data;
    },

});



export const loadingState = atom({
    key: 'loadingState',
    default: false,
});


export const dataState = selector({
    key: 'dataState',
    get: async ({ get, set }) => {
        set(loadingState, true) // Set loading to true before fetching data
        try {
            const response = await fetch('https://dummy.restapiexample.com/api/v1/employees');
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            set(loadingState, false) // Set loading to false after fetching data
        }
    },
});

import { filters } from '../components/filterContainer/';
import { SELECT_FILTER } from '../actions/types';

const initialState = {
    filters: null,
    selectedFilter: filters[0]
};

export default function filterReducer(state = initialState, action) {
    switch(action.type) {
        case SELECT_FILTER:
            return {
                ...state,
                selectedFilter: action.payload
            }
        default: 
            return {
                ...state
            }
    }
}
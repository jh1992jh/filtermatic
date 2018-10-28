import React, { Component } from 'react';
import { filters } from './';

class FilterContainer extends Component {
  render() {
      const { selectFilter, selectedFilter, secondaryClassname} = this.props;
      let outputFilters = filters.map(filter => (
        <div 
        key={filter.title} 
        onClick={() => selectFilter(filter)} 
        style={selectedFilter.title === filter.title ? {background: `rgba(${filter.r + 100}, ${filter.g + 100}, ${filter.b + 100}, 0.5)`} : {background: `rgba(${filter.r + 100}, ${filter.g + 100}, ${filter.b + 100}, 0.5)`}} className={selectedFilter.title === filter.title ? 'selected filter' : 'filter'}>{filter.title}</div>
      ))
    return (
      <div className={`filterContainer ${secondaryClassname}`}>
        <div className="infoAndSelectors">
        <h3>Filters</h3>
        </div>
        <div className="filters">
          {outputFilters}
          </div>
      </div>
    )
  }
}

export default FilterContainer;
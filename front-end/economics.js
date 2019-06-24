function economics() { //Singleton for getting economics data from the budgets csv
  var instance;
  var rawData;
  var data;
  var data4 ={};
  var init =function(){
    console.log(this);

    function divideByCategory(listofCats){
      console.log(this);
      listofCats.forEach(cat => {
        this.rawData.forEach(dataPoint => {
          if (!this.data[dataPoint['LU_ID']]) {
            this.data[dataPoint['LU_ID']] = {'landUse': dataPoint['Land-Use']}
          } // We need to create a path to the data that we want to pull out
          if (!this.data[dataPoint['LU_ID']][cat]){ //if this is the first time that we see a particular category for a particular land use
            this.data[dataPoint['LU_ID']][cat] = {total: 0}; //Further path making
          }
          if(!this.data[dataPoint['LU_ID']][cat][dataPoint[cat]]){ //if this is the first value we need to read
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] = Math.round(1000*Number.parseFloat(dataPoint['Value']))/1000;
          }
          else {//The value already exists so just add to it.
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] = //trying to prevent floating point calculation errors so rounding to tenth of a cent
            //ideally this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])
            Math.round(1000*(this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])))/1000
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]]
          }
          this.data[dataPoint['LU_ID']][cat].total = //either way add it to the total
          Math.round(1000*this.data[dataPoint['LU_ID']][cat].total + 1000*Number.parseFloat(dataPoint['Value']))/1000
        });
      });
      console.log(this.data);
    }

    function divideByLandUse(list){
      console.log(this.rawData);
      list.forEach(l=>{
        this.rawData.forEach(dataPoint => {
          console.log(dataPoint['LU_ID']);
          //console.log(this.data4['LU_ID']);
          if (!this.data4[dataPoint['LU_ID']]) {
            this.data4[dataPoint['LU_ID']] = {'landUse': dataPoint['Land-Use']}
          } // We need to create a path to the data that we want to pull out
        });
      });
       console.log(data4);

    }
    d3.csv('./budgets.csv', function(data){
      this.rawData = data;
      divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
      divideByLandUse(['Action - Cost Type', 'Time - Cost Type']);
    })
    return {//public fields
      data: this.data,
      rawData: this.rawData,
      data4:this.data4
    };
  };
  return {
    getInstance: function () { //To ensure singularity
      if ( !instance ) {
        econ = new economics();
        instance = econ.init();
      }
      return instance;
    }
  };
};

economics().getInstance();//kind of a precalc? Not really but its calculated before its needed.

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    const val = item[prop]
    groups[val] = groups[val] || []
    groups[val].push(item)
    return groups
  }, {})
}

'use strict';

// Based on Mike Bostock's example,
// "Zoomable Icicle"
// http://bl.ocks.org/mbostock/1005873

queue()
    .defer(d3.json, 'data/bmmi.json')
    .await(init);

function init(error, root) {
  root = root["Why are you influential?"];

  Object.keys(root).forEach(function(key,i) {
    var section = d3.select(".treemaps").append("div")
      .classed("treemap-container-wrapper", true)
      .attr("data-section", key);

    section.append("h2").text(key)
      .on("click", function() {
        var tree = d3.select(this.parentNode)
          .select(".treemap-container");
        tree.classed("collapsed", !tree.classed("collapsed"));
      });

    section.append("div")
        .classed("treemap-container", true)
        .classed("collapsed", true)
        .datum(root[key])
        .call(treemap);
  });
}

function treemap(selection) {
  selection.each(function(root) {

    // normalize point distribution
    function apportionPoints(root, points) {
      var keys = Object.keys(root);
      var pointsPerKey = points/keys.length;
      keys.forEach(function(key,i) {
        if(isNaN(root[key])) {
          apportionPoints(root[key], pointsPerKey);
        } else {
          root[key] = pointsPerKey;
        }
      })
    }
    apportionPoints(root, 1);

    // var clickHistory = [],
    //     autopilot = false,
    //     myrtle = ghost();
    // myrtle();

    var partition = d3.layout.partition()
        .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
        .value(function(d) { return d.value; });

    var partitionData = partition(d3.entries(root)[0]);

    var width = d3.select("body").node().getBoundingClientRect().width,
        height = 54 * d3.max(partitionData, function(d) { return d.depth; });

    var x = d3.scale.linear()
        .domain([0, 0, 1, 1])
        .range([0, 0, width, width]);

    var y = d3.scale.linear()
        .domain([0,1])
        .range([0,height]);

    var container = d3.select(this)
        .style("width", width+"px")
        .style("height", height+"px")
        .style("position", "relative");

    var rect = container.selectAll("div")
        .data(partitionData)
      .enter().append("div")
        .classed("node", true)
        .classed("enabled", function(d) { return !d.parent || !d.parent.parent; })
        .classed("clicked", false)
        .classed("no", function(d) { return d.key=="No"; })
        .classed("yes", function(d) { return d.key=="Yes"; })
        .classed("leaf", function(d) { return !d.children; })
        .attr("data-key", function(d) { return d.key; })
        .attr("data-depth", function(d) { return d.depth; })
        .style("position", "absolute")
        .style("left", function(d) { return x(d.x)+"px"; })
        .style("top", function(d) { return y(d.y)+"px"; })
        .style("width", function(d) { return (x(d.x + d.dx) - x(d.x))+"px"; })
        .style("height", function(d) { return (y(d.y + d.dy) - y(d.y))+"px"; })
        .html(function(d) {
          return '<div class="inner">'+(d.children ? d.key : d.key+" →")+'</div>';

        })
        .on("click", clicked)
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted)
        .each(function(d){ d.sel = d3.select(this) });

    /*
    stats();
    d3.select("#stats")
      .on("mouseover", function(d) {
        d3.selectAll(".node:not(.enabled)").classed("hint", true);

        x.range([0, 100, width-100, width]);
        rect.transition()
          .duration(750)
          .style("left", function(d) { return x(d.x)+"px"; })
          .style("top", function(d) { return y(d.y)+"px"; })
          .style("width", function(d) { return (x(d.x + d.dx) - x(d.x))+"px"; })
          .style("height", function(d) { return (y(d.y + d.dy) - y(d.y))+"px"; });
      })
      .on("mouseout", function(d) {
        d3.selectAll(".node:not(.enabled)").classed("hint", false);

        x.range([0, 0, width, width]);
        rect.transition()
          .duration(750)
          .style("left", function(d) { return x(d.x)+"px"; })
          .style("top", function(d) { return y(d.y)+"px"; })
          .style("width", function(d) { return (x(d.x + d.dx) - x(d.x))+"px"; })
          .style("height", function(d) { return (y(d.y + d.dy) - y(d.y))+"px"; });
      })

    // if(location.hash.length > 1) unhashHistory();
    */

    function mouseovered(d) {
      if(!d3.select(this).classed('enabled')) return;
      container.classed("focus", true);
      highlightParent(d);
      if(d.children) {
        d.children.forEach(function(child, index) {
          child.sel.classed("hint", true);
        })
      }
    }

    function mouseouted(d) {
      d3.selectAll(".node.hover").classed("hover", false);
      container.classed("focus", false);
      if(d.children) {
        d.children.forEach(function(child, index) {
          child.sel.classed("hint", false);
        })
      }
    }

    function highlightParent(d) {
      if(d.parent) {
        d.parent.sel.classed("hover", true);
        highlightParent(d.parent);
      }
    }

    function clicked(d) {

      if(d.children) {
        d3.select(this).each(enable);
      } else {
        // navigate to selected person page
        console.log("Navigate to " + d.key);
        var keyArray = d.key.split(" ");
        window.location.href = window.location.href.split("#")[0]+"#"+keyArray[keyArray.length-1].toLowerCase();
      }

    }

    function enable(d) {

      if(!d3.select(this).classed('enabled')) return;

      x.domain([0, d.x, d.x + d.dx, 1]);

      d3.select('.node.active')
        .classed("active", false);

      var el = d3.select(this)
        .classed("clicked", true)
        .classed("active", true);

      // if you disable for autopilot, ghost-driven clicks aren't recorded
      // if(!autopilot || true) clickHistory.push(el);

      if(d.children) {
        d.children.forEach(function(child, index) {
          child.sel.classed('enabled', true);
        })

        if(d.children.length === 1) {
          d.children[0].sel.each(enable);
        }
      }

      rect.transition()
          .duration(750)
          .style("left", function(d) { return x(d.x)+"px"; })
          .style("top", function(d) { return y(d.y)+"px"; })
          .style("width", function(d) { return (x(d.x + d.dx) - x(d.x))+"px"; })
          .style("height", function(d) { return (y(d.y + d.dy) - y(d.y))+"px"; });

      // stats();

    }

    ////////////////////////////////////////////////////////
    ///////////////////// BROKEN STUFF /////////////////////
    ////////////////////////////////////////////////////////

    /*
    function stats() {
      // #gamification -_-
      d3.select('#m').text(function() {
        return d3.selectAll('.node.leaf')[0].length;
      })
      d3.select('#n').text(function() {
        return d3.selectAll('.node.leaf.enabled')[0].length;
      })
    }

    // ghost clicks first enabled node
    d3.select("#demo").on("click", function() {
      myrtle.jumpTo(d3.select("#demo .name"));
      myrtle.click(d3.select(".node.enabled"), clickChild);
      function clickChild(d) {
        if(d.children) {
          myrtle.click(d3.shuffle(d.children)[0].sel, clickChild);
        } else {
          myrtle.hide();
        }
      }
    })

    d3.select("#hash").on("click", function() {
      hashHistory(clickHistory);
    })

    function replayHistory(replayQueue) {
      autopilot = true;
      if(replayQueue.length) {
        myrtle.click(replayQueue.shift(), function() {
          replayHistory(replayQueue);
        })
      } else {
        myrtle.hide();
        autopilot = false;
      }
    }

    function hashHistory(myClickHistory) {
      var keys = selectionToKeys(myClickHistory);
      var str = "['" + keys.join("','") + "']";
      var hash = utf8_to_b64(str);
      if(history.pushState) {
        history.pushState(null, null, '#'+hash);
      }
      else {
        location.hash = '#'+hash;
      }
    }

    function unhashHistory(hash) {
      var hash = location.hash.substr(1);
      var str = b64_to_utf8(hash);
      var keys = eval(str);
      var sels = keysToSelection(keys);
      if(!sels[0].empty()) {
        myrtle.jumpTo(d3.select("#hash"));
        replayHistory(sels);
      }
    }

    function selectionToKeys(sels) {
      return sels.map(function(sel) { return sel.datum().key; });
    }

    function keysToSelection(keys) {
      return keys.map(function (key) { return d3.select('[data-key="'+key+'"]'); })
    }

    // via https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64.btoa
    function utf8_to_b64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
    function b64_to_utf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
    }
    */

  });
}

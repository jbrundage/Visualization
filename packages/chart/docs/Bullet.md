# Bullet

```meta
{
    "source": "https://github.com/hpcc-systems/Visualization/blob/master/packages/chart/src/Bullet.ts#L7",
    "extends": "HTMLWidget"
}
```
```sample-code
import { Bullet } from "@hpcc-js/chart";

new Bullet()
    .target("target")
    .columns(["title", "subtitle", "measures", "markers"])
    .data([
        ["Revenue", "US$, in thousands", [220, 270], [250, 25]],
        ["Profit  ", "%", [21, 23], [26]],
        ["Order Size", "US$, average", [100, 320], [550]],
        ["New Customers", "count", [1000, 1650], 2100],
        ["Satisfaction", "out of 5", [3.2, 4.7], [4.4]]
    ])
    .titleColumn("title")
    .subtitleColumn("subtitle")
    .measuresColumn("measures")
    .markersColumn("markers")
    .render()
    ;
```
```sample-code
import { Bullet } from "@hpcc-js/chart";

new Bullet()
    .target("target")
    .columns(["title", "subtitle", "ranges", "measures", "markers"])
    .data([
        ["Revenue", "US$, in thousands", [150, 225, 300], [220, 270], [250, 25]],
        ["Profit  ", "%", [20, 25, 30], [21, 23], [26]],
        ["Order Size", "US$, average", [350, 500, 600], [100, 320], [550]],
        ["New Customers", "count", [1400, 2000, 2500], [1000, 1650], 2100],
        ["Satisfaction", "out of 5", [3.5, 4.25, 5], [3.2, 4.7], [4.4]]
    ])
    .titleColumn("title")
    .subtitleColumn("subtitle")
    .rangesColumn("ranges")
    .measuresColumn("measures")
    .markersColumn("markers")
    .render()
    ;
```


## API

## Published Properties
```@hpcc-js/chart:Bullet
```

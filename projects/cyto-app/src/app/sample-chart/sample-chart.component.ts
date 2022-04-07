import { createViewChild } from '@angular/compiler/src/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-sample-chart',
  templateUrl: './sample-chart.component.html',
  styleUrls: ['./sample-chart.component.scss'],
})
export class SampleChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) root!: ElementRef;
  private types: Map<string, any>;
  private tree: Entity;
  constructor() {
    this.types = new Map<string, any>();
    this.types.set('container', Container);
    this.types.set('circle', Circle);
    this.types.set('square', Square);
    this.tree = {
      type: 'container',
      layout: { width: 100, height: 30, position: [30, 50], fill: 'purple' },
      children: [
        {
          type: 'square',
          layout: { width: 300, height: 20, position: [30, 50], fill: 'green' },
          children: [
            {
              type: 'square',
              layout: {
                width: 200,
                height: 20,
                position: [70, 70],
                fill: 'red',
              },
              children: [],
            },
          ],
        },
        {
          type: 'circle',
          layout: { r: 4, position: [90, 25], fill: 'blue' },
          children: [],
        },
      ],
    };
  }

  ngOnInit(): void {
    const flatList: ChartEntity[] = [];
    const svg = d3
      .select(this.root.nativeElement)
      .append('svg')
      .attr('width', 2000)
      .attr('height', 2000);
    const rootEntity = this.compile(this.tree, flatList, svg);

    // d3.select(this.root.nativeElement)
    //   .append('svg')
    //   .attr('width', 1000)
    //   .attr('height', 500)
    //   .append('circle')
    //   .attr('cx', 100)
    //   .attr('cy', 100)
    //   .attr('r', 10);
  }

  compile(
    /*sng*/ entity: Entity,
    entities: ChartEntity[],
    /*parent: ChartEntity,*/ svg: any
  ) {
    const cEntity = new (this.types.get(entity.type))(entity) as ChartEntity;
    // no - render needs to be done when you iterate trough the flat list?
    // bind?
    // I want to be able to bind entities to bound data lists
    // cEntity.
    const eEl = cEntity.render(svg);

    // need to set props on each entity.
    // Need to centralize the props for entity and the configuration. maybe just pass a parent reference and do pubsub based on config list
    // so parent.output = 'click' ????
    // compoent has ts and html where you can define properties and interface with child components that also have ts and html with props and template
    entities.push(cEntity);
    entity.children.forEach((x) =>
      cEntity.children.push(this.compile(x, entities, /*cEntity,*/ eEl))
    ); //cEntity.setChild(x, entities)
    return cEntity;
  }
}

export interface Entity {
  type: string;
  layout: any;
  children: Entity[];
}

export abstract class ChartEntity /*<EntityType>*/ {
  // public base!: EntityType;
  public props!: Map<string, any>;
  public type!: string;
  public parent!: any;
  public children: ChartEntity[] = [];

  constructor(public config: Entity) {}
  abstract render(el: any): any;
  abstract bind(el: any): any;
}

export class Container extends ChartEntity {
  // private config!: Entity;
  constructor(config: Entity) {
    super(config);
    this.type = 'container';
  }
  public render(el: any) {
    const g = el.append('g');
    g.append('rect')
      .attr('fill', this.config.layout.fill)
      .attr('height', this.config.layout.height)
      .attr('width', this.config.layout.width)
      .attr('x', this.config.layout.position[0])
      .attr('y', this.config.layout.position[1]);
    return g;
  }
  public bind(el: any) {}
}

export class Circle extends ChartEntity {
  // private config!: Entity;
  constructor(config: Entity /*props, svg*/) {
    super(config);
    this.type = 'circle';
  }
  init() {
    // maybe I need to discard the idea of the config
    // set output parameter
    // child.output('update-menu' (props) => this.changeParentRender(props))
  }
  public render(el: any) {
    const g = el.append('g');
    g.append('circle')
      .attr('fill', this.config.layout.fill)
      .attr('r', this.config.layout.r)
      .attr('cx', this.config.layout.position[0])
      .attr('cy', this.config.layout.position[1]);
    return g;
  }
  public bind(el: any) {
    el.on('click', (e: any) => console.log(e)); // getchild then child.update('childname', val)
  }
}
export class Square extends ChartEntity {
  // private config!: Entity;
  constructor(config: Entity) {
    super(config);
    this.type = 'square';
  }
  public render(el: any) {
    const g = el.append('g');
    g.append('rect')
      .attr('fill', this.config.layout.fill)
      .attr('height', this.config.layout.height)
      .attr('width', this.config.layout.width)
      .attr('x',0)
      .attr('y', 0);

    // a hook or handle that moves a group needs to be outside the group
    const rect = el
      .append('rect')
      .attr('fill', 'orange')
      .attr('height', 20)
      .attr('width', 20)
      .attr('x', this.config.layout.position[0])
      .attr('y', this.config.layout.position[1]);

    const dragEvent = d3
      .drag()
      .filter((event) => !event.button)
      .on('start', (d) => {})
      .on('drag', (event, d) => {
        rect.attr('x', event.x);
        rect.attr('y', event.y);
        g.attr('transform', `translate(${event.x},${event.y})`);
      });

    rect.call(dragEvent);
    return g;
  }
  public bind(el: any) {}
}

//Maybe jsut have a list of entities / complex chart objects that get associated with each data point

// have json defined by interface, that wires up the recursive stack of Containers
// export class SquareContainer extends ChartEntity<string> {
//   render() {}
//   bind() {}
// }

// MY MAIN IDEA IS TO ALLOW FOR EASY complex modification of visualizations like an arrow that you mouse over to get a button that opens a menu

// with below entity def, how do we configure a tree with different types of entities as nodes
export class TestEntity {
  private title: string = '';
  private rectEl: any;
  constructor(private props: any, private el: any) {
    this.compile();
  }
  public compile() {
    // create children
    // for x of y => createIterChild()
    // like reading in a list of menu options for circular menu

    // MY MAIN IDEA IS TO ALLOW FOR EASY complex modification of visualizations like an arrow that you mouse over to get a button that opens a menu

    this.createCircle();
    this.createRect();
  }
  // public creatIterChild() {
  //   const props = {};
  //   const child = new ChildEntity(props, this.el);
  // }
  public createCircle() {
    const circleEl = this.el
      .append('g')
      .append('circle')
      .attr('r', this.props.layout.r)
      .attr('cx', this.props.layout.position[0])
      .attr('cy', this.props.layout.position[1]);

    circleEl.on('mousedown', (e: any) =>
      this.props.toggleChart({ event: e, title: this.title })
    );
  }
  public createRect() {
    const rectEl = this.el
      .append('g')
      .append('rect')
      .attr('height', this.props.layout.width)
      .attr('width', this.props.layout.height)
      .attr('x', this.props.layout.position[0])
      .attr('y', this.props.layout.position[1]);

    rectEl.on('mousedown', (e: any) =>
      this.props.toggleChart({ event: e, title: this.title })
    );
  }

  // public render(/*el: any*/) {
  //   this.rectEl.append('g')
  //   .append('rect')
  //   .attr('height', this.props.layout.width)
  //   .attr('width', this.props.layout.height)
  //   .attr('x', this.props.layout.position[0])
  //   .attr('y', this.props.layout.position[1]);
  // }
  // public bind(el: any) {
  //   this.rectEl.on('mousedown', (e: any) =>
  //   this.props.toggleChart({ event: e, title: this.title })
  // );
  // }
}

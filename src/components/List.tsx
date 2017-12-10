import * as React from 'react'

import Filter from './Filter'

interface Record { uid: string }

export interface Props {
  name: string
  objects: Record[]
  component: React.ComponentClass<{ object: Record }>
}

export interface State {
  limit: number
  objects: Record[]
}

class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      limit: 25,
      objects: []
    }
  }

  componentWillMount() {
    this.doFilter([])
  }

  componentWillReceiveProps(nextProps: Props) {
    this.doFilter(nextProps.objects)
  }

  more() {
    this.setState({ limit: this.state.limit + 25 })
  }

  doFilter(objects: Record[]) {
    this.setState({
      limit: 25,
      objects: objects.length ? objects : this.props.objects
    })
  }

  render() {
    const objects = this.state.objects.slice(0, this.state.limit)

    // TODO: the filter here may be confusing, should
    //   probably support searching by formula as well
    // TODO: add "infinite" scroll for paging
    return (
      <section className={this.props.name}>
        <Filter
          collection={this.props.objects}
          onChange={objs => this.doFilter(objs)}
          placeholder={`Filter ${this.props.name} by text`}
        />

        {objects.map((obj: Record) => <this.props.component key={obj.uid} object={obj} />)}

        {this.props.objects.length > this.state.limit
          ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
          : ''}
      </section>
    )
  }
}

export default List

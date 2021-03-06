import React, { Component } from 'react';
import { StyleSheet, View, Image, Keyboard, StatusBar } from 'react-native';
import { AdMobBanner } from 'expo';
import Navbar from '../components/Navbar';
import Results from '../components/Results';

export default class ResultsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      loaded: false,
    }
  }

  apiCall() {
    const { navigation } = this.props;
    const passedData = navigation.getParam('passedData', []);

    let selectedIngredients = passedData;
    selectedValues = selectedIngredients.map((ingredient) => ingredient.value)
    Values = selectedValues.join(',');
    ValuesInString = Values.replace(' ', "+")

    let url = "http://www.recipepuppy.com/api/?i=" + ValuesInString
    this.setState({ loading: true });
    Keyboard.dismiss()

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          userdata: responseJson.results,
          loading: false,
          loaded: true,
        });
      })
  }

  componentWillReceiveProps() {
    this.apiCall();
    const { navigation } = this.props;
    navigation.addListener('didFocus', () => this.apiCall());
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('didFocus', () => this.apiCall());
  }

  render() {
    const { navigation } = this.props;
    const passedData = navigation.getParam('passedData', 'some default value');

    return (
      <View style={s.container}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.20)"
          animated
        />
        <Navbar title="Results" name="refresh" function="" handle={() => this.apiCall()} type="icon" />

        {this.state.loading ?
          <View style={s.spinner}>
            <Image style={{ width: 25, height: 25 }}
              source={require('../assets/loading.gif')}
            />
          </View>
          : null}

        {this.state.loaded ?
          <Results results={this.state.userdata} />
          : null}

        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <AdMobBanner
            adSize="smartBanner"
            adUnitID="ca-app-pub-8573101599140905/4705314737"
          />
        </View>


      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
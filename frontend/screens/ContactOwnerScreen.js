import React from 'react';
import 'react-native-gesture-handler';
import {Button, View, Text, Image, Alert} from 'react-native';
import {rgbToHex} from '../util/rgbToHex';
import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

const pet_text = "Pet's Information";

export default class ContactOwnerScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pet: this.props.navigation.state.params.petInfo,
      // totalColor: this.props.navigation.state.params.petInfo.colours.totalColor,
      // croppedColor: this.props.navigation.state.params.petInfo.colours
      //   .croppedColor,
      // finalColor: this.props.navigation.state.params.petInfo.colours.finalColor,
    };
  }

  async contact() {
    //get the reporter's user id
    var id = this.state.pet.report.fk_user_id;
    const url =
      'http://ec2-34-214-245-195.us-west-2.compute.amazonaws.com:6464/getUserContactInfo/' +
      `${id}`;
    const request = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    //get the reporter's contact information
    let result = await fetch(url, request);
    if (result.status === 400) {
      this.setState({
        contactInfo: 'Sorry, reporter rejects your contact request',
      });
    } else {
      Alert.alert('Request sent!');
      this.setState({contactInfo: result.json()});
    }
  }

  extractTags(arr) {
    // console.log(arr);
    var tag = '';
    var jsonArr = JSON.parse(arr);
    for (let i = 0; i < jsonArr.length; i++) {
      tag = tag.concat(`${jsonArr[i].Name}, `);
    }
    // console.log(tag);
    return tag;
  }

  render() {
    return (
      <View style={styles.contact_container} testID={'ContactScreen_detox'}>
        <Text style={styles.contact_titleText}> {pet_text} </Text>
        <View style={styles.imageAndTextContainer}>
          <Image
            source={{
              uri: `https://lostpetpictures.s3-us-west-2.amazonaws.com/${this.state.pet.report.file_name}`,
            }}
            style={styles.imageView}
            testID={'PetImage_detox'}
          />
          <View style={styles.detailsView}>
            <Text style={styles.rateTitleText}>Address: </Text>
            <Text
              style={
                styles.rateText
              }>{`${this.props.navigation.state.params.address}`}</Text>
            <Text style={styles.rateTitleText}>Reported: </Text>
            <Text
              style={
                styles.rateText
              }>{`${this.props.navigation.state.params.dateString}`}</Text>
            <Text style={styles.rateTitleText}> {'AI Generated Tags:'}</Text>
            <Text style={styles.rateText}>{`${this.extractTags(
              this.state.pet.report.tags,
            )}`}</Text>
          </View>
        </View>

        <View style={styles.viewContainer}>
          <Text style={styles.aiTags}>Scoring Breakdown: </Text>
          <Text style={styles.infoText}>{`Colour: ${
            (this.state.pet['colour score'] * 100).toFixed(0) + '%'
          }`}</Text>
          <Text style={styles.infoText}>{`Date: ${
            (this.state.pet['date score'] * 100).toFixed(0) + '%'
          }`}</Text>
          <Text style={styles.infoText}>{`Location: ${
            (this.state.pet['distance score'] * 100).toFixed(0) + '%'
          }`}</Text>
          <Text style={styles.infoText}>{`Image Recognition: ${
            (this.state.pet['intersection score'] * 100).toFixed(0) + '%'
          }`}</Text>
          <Text style={styles.aiTags}>{`Total: ${
            ((this.state.pet['total score'] * 100) / 4).toFixed(0) + '%'
          }`}</Text>
        </View>

        {/* <Text>
            {"reporter contact information will be shown"}
        </Text> */}

        <TouchableOpacity
          style={styles.contactButton}
          testID={'ContactButton_detox'}
          onPress={() => this.contact()}>
          <Text style={styles.textStyle}>Contact reporter</Text>
        </TouchableOpacity>

        {/* <View style={styles.horizontalFlexContainer}>
          <View style={styles.colorUnit}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: rgbToHex(
                    this.state.totalColor[0],
                    this.state.totalColor[1],
                    this.state.totalColor[2],
                  ),
                },
              ]}
            />
            <Text style={styles.colorText}>Overall Color</Text>
          </View>

          <View style={styles.colorUnit}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: rgbToHex(
                    this.state.croppedColor[0],
                    this.state.croppedColor[1],
                    this.state.croppedColor[2],
                  ),
                },
              ]}
            />
            <Text style={styles.colorText}>Cropped Color</Text>
          </View>

          <View style={styles.colorUnit}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: rgbToHex(
                    this.state.finalColor[0],
                    this.state.finalColor[1],
                    this.state.finalColor[2],
                  ),
                },
              ]}
            />
            <Text style={styles.colorText}>Final Color</Text>
          </View>
        </View> */}
      </View>
    );
  }
}

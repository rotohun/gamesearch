import React, { Children } from 'react';
import { View, Text, SectionList, SafeAreaView,Image, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 

const types = {
    events: 'evn',
    performers: 'perf',
    venues: 'ven'
}

const ListItem = ({ children, style}) => {
    return (
        <View style={[ style, { backgroundColor: '#121212', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 20, justifyContent: 'space-between'}]}>
            {children}
        </View>
    )
}

const renderEvents = (item) => {
    return (
    <ListItem style={{ backgroundColor: '#121212', paddingVertical: 5}}>
        <Text style={{ color: '#fff'}}>
            {item.event.category}
        </Text>
    </ListItem> 
    )
}

const renderPerformers = (item) => {
    return (
        <ListItem style={{ height: 80, alignItems: 'center', borderBottomWidth: 1, borderColor: '#000',}}>
            <View style={{ flexDirection: "row", alignItems: 'center'}}>
                <Image source={{ uri: item['hero_image_url']}} style={{  height: 50, width: 50, borderRadius: 100, marginRight: 10 }} />
                <View>
                    <Text style={{ color: '#fff', fontWeight: 'bold'}}>
                    {item.name}
                    </Text>
                    <Text style={{ color: 'lightgrey'}}>
                    {item.category}
                    </Text>
                </View>
            </View>
        </ListItem>
    )
}

const renderVenues = (item) => {
    return (
        <ListItem style={{ backgroundColor: '#121212', paddingVertical: 5, borderBottomWidth: 1, borderColor: '#000',}}>
            <View style={{ flexDirection: "row", alignItems: 'center'}}>
                <Image source={{ uri: item['image_url']}} style={{  height: 50, width: 50, borderRadius: 100, marginRight: 10 }} />
                <View>
                    <Text style={{ color: '#fff', fontWeight: 'bold'}}>
                        {item.name}
                    </Text>
                    <Text style={{ color: 'lightgrey'}}>
                        VENUE {item.city},{item.state}
                    </Text>
                </View>
            </View>
        </ListItem>
    )
}

const renderElement = (id, item) => {
    if( id === types.events) {
        return renderEvents(item)
    } else if(id === types.performers) {
        return renderPerformers(item)
    } else if (id === types.venues) {
        return renderVenues(item)
    }
}

const SearchScreen = () => {
    const [events, setEvents] = useState([])
    const [performers, setPerformers] = useState([])
    const [venues, setVenues] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    useEffect(() => {
      return () => {
        Axios.get(`https://mobile-staging.gametime.co/v1/search?q=${search}`)
        .then((res) => {
            setEvents(res.data.events)
            setPerformers(res.data.performers)
            setVenues(res.data.venues)
            setLoading(false)
        })
        .catch((res) => {
            setError(true)
            setLoading(false)
        })
      };
    }, [search])
    // data[0].event.category
    return (
        <SafeAreaView style={{ backgroundColor: '#000', flex: 1, paddingHorizontal: 20}}>
            <SearchBar
                round={true}
                platform="ios"
                showCancel={true}
                cancelButtonTitle={'Cancel'}
                value={search}
                onChangeText={(e) => {
                    setSearch(e)
                }}
                onSubmitEditing={(event) => {
                    setSearch(event.nativeEvent.text)
                }}
                onCancel={()=>console.log('ghi')}
                placeholder={'Team, performer or venue'}
                containerStyle={{ backgroundColor: 'transparent', paddingHorizontal: 15, marginBottom: 20}}
                cancelButtonProps={{ color: 'white'}}
                inputContainerStyle={{ backgroundColor: '#1f1e1d', borderRadius: 20, paddingHorizontal: 10}}
                inputStyle={{ color: '#fff'}}
            />
            <SectionList 
                sections={[
                    {title: 'Events', data: events, id:types.events},
                    {title: 'Performers', data: performers, id:types.performers},
                    {title: 'Venues', data: venues, id:types.venues}
                ]}
                keyExtractor={(item, index) => item + index}
                renderItem={({item, section: {id}}) => {
                    return renderElement(id, item)
                }}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={{ backgroundColor: '#1f1e1d', height: 30, paddingHorizontal: 20, justifyContent: 'center',}}>
                        <Text style={{ color: '#fff', fontSize: 18}}>{title}</Text>
                    </View>
                )}
                renderSectionFooter={() => {
                    return (
                        <View style={{ width: 15, height: 15 }} />
                    )
                }}
            />
        </SafeAreaView>
    );
}

export default SearchScreen;
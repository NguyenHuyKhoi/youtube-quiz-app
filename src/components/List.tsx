import _ from 'lodash';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import {PaginationEntity} from '@model';
import {sizes} from '@utils';
import axios from 'axios';
import {getAuthHeader} from '@src/api';

export const listRef = React.createRef<any>();
export const list = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FlatListRef<ItemT> {
  refreshList: () => void;
  getListSize: () => number;
}

export interface ListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'data'> {
  url: string;
  params?: any;
  renderItem: React.FC<{item: ItemT; index: number}>;
  keyExtractor: (item: ItemT) => string;
  renderListHeader?: React.FC<{item: ItemT}>;
  renderListFooter?: React.FC<{item: ItemT}>;
  renderListEmpty?: React.FC<{item: ItemT}>;
  searchKey?: string;
  ignoreData?: ItemT[];
  emptyLabel?: string;
  onChangeDataSize?: (size: number) => void;
  scrollEnabled?: boolean;
}

export const List = React.forwardRef(
  <ItemT,>(props: ListProps<ItemT>, ref: Ref<FlatListRef<ItemT>>) => {
    const {
      url,
      params,
      renderItem,
      keyExtractor,
      renderListHeader,
      renderListFooter,
      renderListEmpty,
      searchKey,
      ignoreData,
      onChangeDataSize,
      scrollEnabled,
    } = props;

    useImperativeHandle(ref, () => ({
      refreshList: () => {
        onRefresh();
        currentListRef.current?.scrollToOffset({animated: true, offset: 0});
      },
      getListSize: () => {
        return renderData.length;
      },
    }));
    const currentListRef = React.createRef<FlatList>();
    const [renderData, setRenderData] = useState<ItemT[]>([]);
    const [listData, setListData] = useState<ItemT[]>([]);
    const [searchData, setSearchData] = useState<ItemT[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [currentPagination, setCurrentPagination] = useState<
      PaginationEntity | undefined
    >();
    const [searchPagination, setSearchPagination] = useState<
      PaginationEntity | undefined
    >();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);

    const searching = useCallback(() => {
      return searchKey !== undefined && searchKey !== '';
    }, [searchKey]);

    useEffect(() => {
      setCurrentPage(1);
      setSearchCurrentPage(1);
      currentListRef?.current?.scrollToOffset({animated: true, offset: 0});
      setRenderData([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, searchKey]);

    const handleData = useCallback(() => {
      setLoading(true);

      axios
        .get(url, {
          params: {
            ...params,
            page: searching() ? searchCurrentPage : currentPage,
            search: searching() ? searchKey : undefined,
            per_page: 10,
          },
          headers: getAuthHeader(),
        })
        .then(response => {
          setLoading(false);
          const {data, pagination} = response.data?.data;
          onChangeDataSize && onChangeDataSize(pagination.total);
          if (searching()) {
            setSearchData(
              searchCurrentPage === 1
                ? data ?? []
                : [...searchData, ...(data ?? [])],
            );
            setSearchPagination(pagination);
          } else {
            const newList = currentPage === 1 ? data : [...listData, ...data];
            setListData(newList);
            setCurrentPagination(pagination);
          }
        })
        .catch(e => {
          console.log('error get list: ', JSON.stringify(e, null, 2));
          setLoading(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, searchKey, searching, searchCurrentPage, currentPage, url]);

    useEffect(() => {
      handleData();
    }, [handleData]);

    const onRefresh = useCallback(() => {
      if (loading) {
        return;
      }
      if (searching()) {
        setSearchCurrentPage(1);
      } else {
        setCurrentPage(1);
      }
      handleData();
    }, [handleData, loading, searching]);

    const onLoadMore = useCallback(() => {
      if (loading) {
        return;
      }
      if (searching()) {
        if (
          searchPagination &&
          searchPagination?.to < searchPagination?.total
        ) {
          setSearchCurrentPage(searchCurrentPage + 1);
        }
      } else {
        if (
          currentPagination &&
          currentPagination.to < currentPagination.total
        ) {
          setCurrentPage(currentPage + 1);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPagination, loading, searchPagination, searching]);

    useEffect(() => {
      var data = [];
      if (searching()) {
        data = _.unionBy(
          _.differenceBy(searchData, ignoreData ?? [], 'id'),
          'id',
        );
        //data = _.differenceBy(searchData, ignoreData ?? [], 'id');
      } else {
        data = _.unionBy(
          _.differenceBy(listData, ignoreData ?? [], 'id'),
          'id',
        );
        // data = _.differenceBy(listData, ignoreData ?? [], 'id');
      }
      setRenderData(data);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData, listData, ignoreData]);

    return (
      <View style={styles.container}>
        {/* Search UI */}
        <FlatList
          {...props}
          ref={currentListRef}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled === false ? false : true}
          data={renderData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader ?? null}
          ListFooterComponent={
            renderListFooter ??
            (loading && listData.length > 0 ? (
              <ActivityIndicator animating={true} style={styles.loading} />
            ) : null)
          }
          ListEmptyComponent={renderListEmpty ?? loading ? undefined : <View />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0}
          onEndReached={onLoadMore}
        />
      </View>
    );
  },
) as <ItemT>(
  props: ListProps<ItemT> & {ref?: Ref<FlatList<ItemT>>},
) => React.ReactElement | null;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {marginTop: sizes._20sdp},
});

import { AppHelperCommponent, ModalMessage, ToastMessage } from './apphelper/apphelper';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, ElementRef, OnInit, ViewChild, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms'
import { debounceTime } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

interface Song {
  id: string;
  title: string;
  compose: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
}

//declare let ClientIP: any;

@Component({
  selector: 'app-root',
  // tslint:disable-next-line:max-line-length
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, AppHelperCommponent],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0px',
        overflow: 'hidden',
        opacity: 0,
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out'),
      ]),
    ])
  ]
})

export class AppComponent implements OnInit {
  songlist: any = [];
  songlistFilter: any = [];
  _selectItem: any;
  _state: string = '';
  _singer: string = '';
  _songname: string = '';
  _link: string = '';
  pagebackgroundImg: string;
  displaypopuup = false;

  menuShow: string = 'music'
  currentAudio: string = '';
  playlists: any = [];
  private currentPlaylistSongs: Song[] = [];
  private currentSongIndex = 0;
  nowPlayingSong: Song | null = null;
  expandedPlaylistId: string | null = null;
  newPlaylistName: string | null = null;
  hideAddSongFormTimeout: any = null;

  showAddSongFormFor: string | null = null;
  newSong: Song = { id: '', title: '', compose: '', url: '' };

  notice: any;
  searchField: FormControl;
  // @ViewChild('snowfallbackground') snowfallbackground: SnowfallbackgroundComponent;
  @ViewChild('player') playerRef!: ElementRef<HTMLAudioElement>;

  constructor(public apphelper: AppHelperCommponent, private router: Router, private route: ActivatedRoute, private confirmationService: ConfirmationService, private deviceService: DeviceDetectorService, private firestore: AngularFirestore, private messageService: MessageService) {
    //console.log(environment);
  }

  async ngOnInit() {
    //this.apphelper.ShowLoading();

    //console.log('call app ngOnInit');
    // if (this.apphelper.CurrentDate().substr(4, 4) == '1225') {
    //   this.snowfallbackground.ShowSnowFall();
    // }
    // this.songlist = await this.apphelper.ApiGet('./assets/song.json?version=' + new Date().getTime());

    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe(search => {
      this.Search(search);
    });

    this.songlist = [];
    await this.LoadSong();

    await this.loadPlaylists();

    //console.log(this.songlist);
  }

  async LoadSong() {
    //return [];
    this.apphelper.ShowLoading();

    await this.firestore.collection('songlist').snapshotChanges().subscribe(data => {
      //console.log('test');
      this.songlist = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      //console.log(this.songlist);
      this.Search('');
      this.apphelper.HideLoading();
    });



    //return x;

    // let x = this.firestore.collection('songlist').valueChanges();

  }

  ShowSongList() {
    return this.apphelper.Sort(this.songlistFilter, "singer");
  }

  Search(filter: string): any {
    //console.log(filter);
    //console.log(this.menuShow);
    this.apphelper.ShowLoading();

    if (filter !== '') {
      this.songlistFilter = this.songlist.filter(data => data.singer.indexOf(filter) > -1 || data.songname.indexOf(filter) > -1);
    } else {
      this.songlistFilter = this.songlist;
    }

    this.apphelper.HideLoading();

    //console.log(this.menuShowFilter);
  }

  Add() {
    this._state = this.apphelper.Add;
    this._songname = '';
    this._link = '';
    this._singer = '';

    setTimeout(() => this.displaypopuup = true);
    // ;
  }

  Edit() {
    if (this.apphelper.IsNull(this._selectItem))
      return;

    this._state = this.apphelper.Edit;
    this._songname = this._selectItem.songname;
    this._link = this._selectItem.link;
    this._singer = this._selectItem.singer;
    this.displaypopuup = true;
  }

  Del() {
    //console.log(this._selectItem);
    if (this.apphelper.IsNull(this._selectItem))
      return;

    this.confirmationService.confirm({
      message: 'คุณต้องการลบข้อมูล ' + this._selectItem.songname + ' ใช่หรือไม่ ?',
      header: 'Cancel Confirm',
      accept: async () => {
        this.firestore.doc('songlist/' + this._selectItem.id).delete();
        await this.LoadSong();
      }
    });
  }

  async SaveSong() {
    //console.log('xx');

    this.firestore.collection('songlist').add({ "index": this.apphelper.GenRecNo(), "songname": this._songname, "singer": this._singer, "link": this._link });

    await this.LoadSong();
    this.displaypopuup = false;
  }

  async addPlaylist() {
    if (!this.newPlaylistName || this.newPlaylistName.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'กรุณากรอกชื่อ Playlist' });
      return;
    }

    try {
      const newPlaylist = {
        name: this.newPlaylistName.trim(),
        description: '', // ใส่คำอธิบายเพิ่มได้ถ้ามี
      };

      await this.firestore.collection('musicplaylist').add(newPlaylist);
      this.newPlaylistName = ''; // เคลียร์ input หลังเพิ่ม
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'เพิ่ม Playlist เรียบร้อยแล้ว' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'เกิดข้อผิดพลาดในการเพิ่ม Playlist:' });
    }
  }

  deletePlaylist(playlist) {
    this.confirmationService.confirm({
      message: 'คุณต้องการลบ Playlist นี้ ใช่หรือไม่?',
      header: 'ยืนยันการลบ',
      accept: async () => {
        try {
          // ลบเพลงใน Subcollection 'song' ของ Playlist นี้ก่อน
          const songsSnapshot = await this.firestore
            .collection('musicplaylist')
            .doc(playlist.id)
            .collection('song')
            .get()
            .toPromise();

          const batch = this.firestore.firestore.batch();

          songsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });

          // ลบ Playlist เอง
          const playlistRef = this.firestore.collection('musicplaylist').doc(playlist.id).ref;
          batch.delete(playlistRef);

          await batch.commit();

          // โหลดข้อมูล Playlist ใหม่
          // this.loadPlaylists();

          this.messageService.add({ severity: 'success', summary: 'success', detail: 'ลบ Playlist เรียบร้อยแล้ว' });
        } catch (error) {
          console.error('ลบ Playlist ไม่สำเร็จ:', error);
          alert('เกิดข้อผิดพลาดในการลบ Playlist');
        }
      }
    });
  }

  addSong() {

  }

  async deleteSong(playlistId: string, songId: string) {
    this.confirmationService.confirm({
      message: 'คุณต้องการลบเพลงนี้ใช่หรือไม่?',
      header: 'ยืนยันการลบ',
      accept: async () => {
        try {
          await this.firestore
            .collection('musicplaylist')
            .doc(playlistId)
            .collection('song')
            .doc(songId)
            .delete();

          this.messageService.add({
            severity: 'success',
            summary: 'ลบเพลงสำเร็จ',
            detail: 'เพลงถูกลบออกจาก Playlist แล้ว'
          });

          // โหลดข้อมูล playlist ใหม่หลังลบ
          await this.loadPlaylists();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'เกิดข้อผิดพลาด',
            detail: 'ไม่สามารถลบเพลงได้ กรุณาลองใหม่อีกครั้ง'
          });
          console.error('Delete song error:', error);
        }
      }
    });
  }

  playAudio(url: string) {
    // this.currentAudio = 'https://audio-variant-previews.envatousercontent.com/M4A/f7/64/cc/af/e9/v1_E11/E1130FIQ.m4a';
    // this.startAudio();
  }

  startAudio() {
    // const audio = this.playerRef.nativeElement;
    // console.log(audio)

    // // โหลดไฟล์เสียงใหม่ (ถ้าจำเป็น)
    // setTimeout(() => {
    //   audio.load();

    //   // เล่นเพลง
    //   audio.play().catch(err => {
    //     console.error('ไม่สามารถเล่นเพลงได้:', err);
    //   });
    // }, 100)
  }

  loadPlaylists() {
    this.playlists = [];

    this.firestore.collection('musicplaylist').snapshotChanges().subscribe(async playlistsSnapshot => {
      this.playlists = [];

      for (const playlistDoc of playlistsSnapshot) {
        const playlistId = playlistDoc.payload.doc.id;
        const playlistData = playlistDoc.payload.doc.data() as any;

        const songsSnapshot = await this.firestore
          .collection('musicplaylist')
          .doc(playlistId)
          .collection('song')
          .get()
          .toPromise();

        const songs: Song[] = songsSnapshot.docs.map(songDoc => ({
          id: songDoc.id,
          playlistId: playlistId,
          playlistName: playlistData.name, // ✅ ใส่ชื่อ Playlist เข้าไป
          ...(songDoc.data() as any)
        }));

        // เรียงเพลงตาม title
        songs.sort((a, b) => a.title.localeCompare(b.title));

        this.playlists.push({
          id: playlistId,
          name: playlistData.name,
          description: playlistData.description,
          songs
        });

        this.playlists.sort((a, b) => a.name.localeCompare(b.name));


      }

      console.log(this.playlists)
    });


  }

  playAllPlaylist() {
    if (!this.playlists || this.playlists.length === 0) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'เพิ่ม Playlist สำเร็จแล้ว' });
      alert('ไม่มี Playlist');
      return;
    }

    this.currentPlaylistSongs = [];

    this.playlists.forEach(playlist => {
      this.currentPlaylistSongs.push(...playlist.songs)
    });

    this.currentSongIndex = 0;

    this.playCurrentSong();

    // ตั้ง event listener ฟังเพลงจบเพื่อเล่นเพลงถัดไป
    const audio = this.playerRef.nativeElement;
    audio.onended = () => {
      this.playNextSong();
    };
  }

  toggleExpand(playlistId: string) {
    this.expandedPlaylistId =
      this.expandedPlaylistId === playlistId ? null : playlistId;

    this.cancelAddSongForm();
  }

  playAllSongs(playlist: Playlist, index: number = 0) {
    if (!playlist.songs || playlist.songs.length === 0) {
      alert('Playlist นี้ยังไม่มีเพลงครับ');
      return;
    }

    this.currentPlaylistSongs = playlist.songs;
    this.currentSongIndex = index;

    this.playCurrentSong();

    // ตั้ง event listener ฟังเพลงจบเพื่อเล่นเพลงถัดไป
    const audio = this.playerRef.nativeElement;
    audio.onended = () => {
      this.playNextSong();
    };
  }

  pauseSong() {
    setTimeout(() => {
      const audio = this.playerRef.nativeElement;
      audio.pause();
    }, 100);
  }

  stopSong() {
    setTimeout(() => {
      const audio = this.playerRef.nativeElement;
      audio.pause();
      audio.currentTime = 0;
    }, 100);
  }

  continueSong() {
    setTimeout(() => {
      const audio = this.playerRef.nativeElement;
      audio.play().catch(err => {
        console.error('ไม่สามารถเล่นเพลงได้:', err);
      });
    }, 100);
  }

  private playCurrentSong() {
    const song = this.currentPlaylistSongs[this.currentSongIndex];
    if (!song) return;

    this.currentAudio = song.url;
    this.nowPlayingSong = song;

    // ต้อง delay load และ play หลัง set currentAudio เพื่อให้ src โหลดเสร็จ
    setTimeout(() => {
      const audio = this.playerRef.nativeElement;
      audio.load();
      audio.play().catch(err => {
        console.error('ไม่สามารถเล่นเพลงได้:', err);
      });
    }, 100);
  }

  playNextSong() {
    this.currentSongIndex++;
    if (this.currentSongIndex < this.currentPlaylistSongs.length) {
      this.playCurrentSong();
    } else {
      this.currentSongIndex = this.currentPlaylistSongs.length - 1;
    }
  }

  playBackSong() {
    this.currentSongIndex--;
    if (this.currentSongIndex >= 0) {
      this.playCurrentSong();
    } else {
      this.currentSongIndex = 0;
    }
  }

  toggleAddSongForm(playlistId: string) {
    if (this.showAddSongFormFor === playlistId) {
      // ตั้งเวลาให้ animation ได้เล่นก่อนซ่อนจริง
      this.hideAddSongFormTimeout = setTimeout(() => {
        this.showAddSongFormFor = null;
        this.hideAddSongFormTimeout = null;
      }, 300); // ตรงกับเวลาที่กำหนดใน animation

    } else {
      // ยกเลิก timeout ถ้ามีอยู่
      if (this.hideAddSongFormTimeout) {
        clearTimeout(this.hideAddSongFormTimeout);
        this.hideAddSongFormTimeout = null;
      }

      this.showAddSongFormFor = playlistId;
      this.newSong = { id: '', title: '', compose: '', url: '' };
    }
  }

  cancelAddSongForm() {
    this.showAddSongFormFor = null;
    this.newSong = { id: '', title: '', compose: '', url: '' };
  }

  async saveSongToPlaylist(playlistId: string) {
    if (!this.newSong.title || !this.newSong.url) {
      alert('กรุณากรอกชื่อเพลงและลิงก์');
      return;
    }

    try {
      await this.firestore.collection('musicplaylist')
        .doc(playlistId)
        .collection('song')
        .add({
          title: this.newSong.title,
          compose: this.newSong.compose,
          url: this.newSong.url,
        });

      this.cancelAddSongForm(); // clear form
      await this.loadPlaylists();
      this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มเพลงสำเร็จ' });
    } catch (error) {
      console.error('เพิ่มเพลงไม่สำเร็จ:', error);
      alert('ไม่สามารถเพิ่มเพลงได้');
    }
  }
}
